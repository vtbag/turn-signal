import { direction, activation } from './navigation';

let anchor: Element | null = null;

addEventListener('DOMContentLoaded', () => {
	document.addEventListener('click', (event) => {
		const target = event.composedPath()[0];
		anchor = target instanceof Element ? target.closest('a, area') : null;
		anchor = anchor?.hasAttribute('data-vtbag-link-types') ? anchor : null;
	});
});

addEventListener('pageswap', (event) => {
	if (!event.viewTransition) return;
	const lastAnchor = anchor;
	anchor = null;
	let types = history.state?.vtbagTypes ?? '';
	if (activation(event).navigationType === 'traverse' && direction(event) === 'backward') return;
	if (lastAnchor) {
		types = lastAnchor.getAttribute('data-vtbag-link-types') ?? '';
		console.log('s-types :>> ', types);
		setViewTransitionTypes(types);
	}
	sessionStorage?.setItem('vtbag-link-types', types.split(/\s*\/\s*/, 1)[0]);
	sessionStorage
		?.getItem('vtbag-link-types')
		?.split(/\s+/)
		.forEach((type) => event.viewTransition?.types?.add(type));
	console.log('x', ...event.viewTransition?.types);
});

addEventListener('pagereveal', (event) => {
	if (!event.viewTransition) return;
	let types = sessionStorage?.getItem('vtbag-link-types') ?? '';
	if (activation().navigationType === 'traverse' && direction() === 'backward') {
		types = history.state?.vtbagTypes ?? '';
		types.includes('/') && (types = types.split(/\s*\/\s*/, 2)[1]);
	}
	types.split(/\s+/).forEach((type) => event.viewTransition?.types?.add(type));
	console.log('r-types :>> ', [...event.viewTransition?.types]);
});

export function setViewTransitionTypes(types: string) {
	history.replaceState({ ...history.state, vtbagTypes: types }, '');
}
