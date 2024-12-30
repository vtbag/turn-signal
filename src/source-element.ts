let anchor: Element | null = null;

const DomContentLoaded= () => {
	document.addEventListener('click', (event) => {
		const target = event.composedPath()[0];
		anchor = target instanceof Element ? target.closest('a, area') : null;
	});
}
addEventListener('DOMContentLoaded', DomContentLoaded);

export function sourceElement() {
	const res = anchor;
//	anchor = null;
	return res;
}
