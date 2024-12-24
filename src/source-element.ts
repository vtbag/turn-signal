let anchor: Element | null = null;

addEventListener('DOMContentLoaded', () => {
	document.addEventListener('click', (event) => {
		const target = event.composedPath()[0];
		anchor = target instanceof Element ? target.closest('a, area') : null;
	});
});

export function sourceElement() {
	const res = anchor;
	anchor = null;
	return res;
}
