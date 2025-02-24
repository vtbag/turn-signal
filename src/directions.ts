import { from, fromUrl, to, toUrl } from './history';

const currentScript = document.currentScript;

function directionAttribute(toIdx: number, fromIdx: number) {
	let value;
	let attributeName;
	let direction = ['backward', 'same', 'forward'];
	const dir = currentScript!.dataset.directionAttribute;
	if (dir) {
		direction = dir.trim().split(/\s*,\s*/);
		if (direction.length !== 4) {
			console.error(
				`[turn-signal] syntax error: data-direction-attribute value "${dir}" does not match "attributeName, backwardValue, sameValue, forwardValue"`
			);
		} else {
			attributeName = direction.shift()!;
			value = toIdx < fromIdx ? direction[0] : toIdx === fromIdx ? direction[1] : direction[2];
		}
	}
	return { attributeName, value };
}

function directionType(hereIdx: number, fromIdx: number) {
	let direction = ['backward', 'same', 'forward'];
	const dir = currentScript!.dataset.directionTypes;
	if (dir) {
		direction = dir.trim().split(/\s*,\s*/);
		if (direction.length !== 3) {
			console.error(
				`[turn-signal] syntax error: data-direction-types value "${dir}" does not match "backwardValue, sameValue, forwardValue"`
			);
			return undefined;
		}
	}
	return hereIdx < fromIdx ? direction[0] : hereIdx === fromIdx ? direction[1] : direction[2];
}

function direction(e: PageSwapEvent | PageRevealEvent) {
	if (!e.viewTransition) return;

	let toIdx = to;
	let fromIdx = from;

	const pages = allPages();
	if (pages.length) {
		fromIdx = pages.indexOf(new URL(fromUrl ?? '.', location.href).pathname);
		toIdx = pages.indexOf(new URL(toUrl ?? '.', location.href).pathname);
	}
	sessionStorage.removeItem('vtbag-signal-attribute');
	sessionStorage.removeItem('vtbag-signal-type');

	if (!isNaN(toIdx)) {
		let { attributeName, value } = directionAttribute(toIdx, fromIdx);
		if (attributeName && value) {
			document.documentElement.setAttribute(attributeName, value);
			e.viewTransition.finished.then(() =>
				document.documentElement.removeAttribute(attributeName!)
			);
			sessionStorage.setItem('vtbag-signal-attribute', `${attributeName} ${value}`);
		}

		value = directionType(toIdx, fromIdx);
		if (value) {
			e.viewTransition.types?.add(value);
			sessionStorage.setItem('vtbag-signal-type', value);
		}
	}
	e.viewTransition.types?.add(e.type === 'pageswap' ? 'old' : 'new');
}

function recall(e: PageRevealEvent) {
	if (e.viewTransition) {
		const attribute = sessionStorage.getItem('vtbag-signal-attribute');
		if (attribute) {
			const [name, value] = attribute.split(' ', 2);
			document.documentElement.setAttribute(name, value);
			e.viewTransition.finished.then(() => document.documentElement.removeAttribute(name));
		}
		let value = sessionStorage.getItem('vtbag-signal-type');
		value && e.viewTransition.types?.add(value);
		e.viewTransition.types?.add('new');
	}
}

function allPages() {
	const selector = currentScript!.dataset.selector;
	const pages = selector
		? [...document.querySelectorAll<HTMLAnchorElement>(selector)].map((e) => {
				const u = new URL(e.href ?? '.', location.href);
				return u.pathname;
			})
		: [];
	return pages;
}

'onpageswap' in window && addEventListener('pageswap', direction);
'onpagereveal' in window && addEventListener('pagereveal', direction);
