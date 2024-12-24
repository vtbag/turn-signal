import {
	bare,
	currentIndex,
	historyIndex,
	initHistory,
	lastIndex,
	navigationHistoryKind,
} from './history';

const currentScript = document.currentScript;

function directionAttribute(hereIdx: number, fromIdx: number) {
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
			value = hereIdx < fromIdx ? direction[0] : hereIdx === fromIdx ? direction[1] : direction[2];
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

function direction(e: PageSwapEvent) {
	let activation = e.activation;
	if (navigationHistoryKind === 'vtbagIdURL') {
		activation = {
			from: { url: e.activation.from.url, index: currentIndex } as NavigationHistoryEntry,
			entry: {
				url: e.activation.entry.url,
				index: historyIndex(e.activation.entry.url!),
			} as NavigationHistoryEntry,
			navigationType: e.activation.navigationType,
		};
	}
	if (e.viewTransition && activation) {
		const pages = allPages();
		let toIdx = -1,
			fromIdx = -1;
		if (pages.length) {
			const index = (url: string) => {
				const u = new URL(url, location.href);
				u.searchParams.delete('vtbag');
				const local = u.pathname + u.search + u.hash;
				const idx = pages.indexOf(local);
				return idx;
			};
			toIdx = index(activation.entry?.url ?? '');
			fromIdx = index(activation.from?.url ?? '');
		}
		if (fromIdx === -1 || toIdx === -1) {
			if (bare(activation.from.url!) === activation.entry.url) {
				fromIdx = toIdx = 1;
			}
			if ((fromIdx === -1 || toIdx === -1) && activation.navigationType === 'traverse') {
				toIdx = activation.entry?.index;
				fromIdx = activation.from?.index;
			}
			if (
				(navigationHistoryKind !== 'vtbagId' || activation.navigationType !== 'traverse') &&
				(fromIdx === -1 || toIdx === -1)
			) {
				fromIdx = 0;
				toIdx = activation.from.url === activation.entry.url ? 0 : 1;
			}
		}
		sessionStorage.removeItem('vtbag-signal-attribute');
		sessionStorage.removeItem('vtbag-signal-type');
		if (fromIdx !== -1 || toIdx !== -1) {
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
				e.viewTransition.types.add(value);
				sessionStorage.setItem('vtbag-signal-type', value);
			}
		}
		e.viewTransition.types.add(e.type === 'pageswap' ? 'old' : 'new');
	}
}

function recall(e: PageRevealEvent) {
	initHistory();
	if (e.viewTransition) {
		const attribute = sessionStorage.getItem('vtbag-signal-attribute');
		if (attribute) {
			const [name, value] = attribute.split(' ', 2);
			document.documentElement.setAttribute(name, value);
			e.viewTransition.finished.then(() => document.documentElement.removeAttribute(name));
		}
		let value = sessionStorage.getItem('vtbag-signal-type');
		if (!attribute && !value && navigationHistoryKind === 'vtbagId') {
			value =
				currentIndex === lastIndex ? 'same' : currentIndex < lastIndex ? 'backward' : 'forward';
		}
		value && e.viewTransition.types.add(value);
		e.viewTransition.types.add('new');
	}
}

function allPages() {
	const selector = currentScript!.dataset.selector;
	const pages = selector
		? [...document.querySelectorAll<HTMLAnchorElement>(selector)].map((e) => {
				const u = new URL(e.href ?? '.', location.href);
				return u.pathname + u.search + u.hash;
			})
		: [];
	return pages;
}

'onpageswap' in window && addEventListener('pageswap', direction);
'onpagereveal' in window && addEventListener('pagereveal', recall);
