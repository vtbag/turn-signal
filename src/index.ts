const currentScript = document.currentScript;

function direction(e: PageSwapEvent | PageRevealEvent) {
	const activation =
		e.type === 'pageswap' ? (e as PageSwapEvent).activation : navigation?.activation;
	if (e.viewTransition && activation) {
		const pages = allPages();
		let hereIdx = 1,
			fromIdx = 0;
		if (activation.navigationType === 'traverse' && pages.length === 0) {
			hereIdx = activation.entry?.index;
			fromIdx = activation.from?.index;
		} else {
			if (pages.length) {
				const index = (url: string) => pages.indexOf(new URL(url, location.href).pathname);
				hereIdx = index(activation.entry?.url ?? '');
				fromIdx = index(activation.from?.url ?? '');
				if (hereIdx === -1 || fromIdx === -1) {
					hereIdx = 1;
					fromIdx = 0;
				}
			}
		}
		emit();

		function emit() {
			let direction = ['backward', 'same', 'forward'];
			let value;
			let dir = currentScript!.dataset.directionAttribute;
			if (dir) {
				direction = dir.trim().split(/\s*,\s*/);

				if (direction.length !== 4) {
					console.error(
						`[turn-signal] syntax error: data-direction-attribute value "${dir}" does not match "attributeName, backwardValue, sameValue, forwardValue"`
					);
					return;
				}
				const attributeName = direction.shift()!;
				value =
					hereIdx < fromIdx ? direction[0] : hereIdx === fromIdx ? direction[1] : direction[2];
				if (attributeName && value) {
					document.documentElement.setAttribute(attributeName, value);
					e.viewTransition.finished.then(() =>
						document.documentElement.removeAttribute(attributeName)
					);
				}
			}
			direction = ['backward', 'same', 'forward'];
			dir = currentScript!.dataset.directionTypes;
			if (dir) {
				direction = dir.trim().split(/\s*,\s*/);

				if (direction.length !== 3) {
					console.error(
						`[turn-signal] syntax error: data-direction-types value "${dir}" does not match "backwardValue, sameValue, forwardValue"`
					);
					return;
				}
			}
			value = hereIdx < fromIdx ? direction[0] : hereIdx === fromIdx ? direction[1] : direction[2];
			if (value) e.viewTransition.types.add(value);
			e.viewTransition.types.add(e.type === 'pageswap' ? 'old' : 'new');
		}
	}
}

function allPages() {
	const selector = currentScript!.dataset.selector;
	return selector
		? [...document.querySelectorAll<HTMLAnchorElement>(selector)].map(
				(e) => new URL(e.href ?? '.', location.href).pathname
			)
		: [];
}

'onpagereveal' in window && addEventListener('pagereveal', direction);
'onpageswap' in window && addEventListener('pageswap', direction);
