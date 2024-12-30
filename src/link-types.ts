import { sourceElement } from './source-element';
import {
	navigationType,
	from,
	to,
} from './history';

const LINK_TYPES = 'data-vtbag-link-types';
const ALL_LINK_TYPES = 'vtbag-all-link-types';

const pageSwap = (event: PageSwapEvent) => {
	const lastAnchor = sourceElement();
	if (!event.viewTransition) return;

	const allTypes = JSON.parse(sessionStorage.getItem(ALL_LINK_TYPES) ?? '[]');

	let types = '';
	if (!isNaN(to)) {
		if (to < from) {
			const splitTypes = (allTypes[to] ?? '').split(/\s*\/\s*/);
			types = splitTypes[0] ?? '';
		} else {
			if (navigationType === "traverse") {
				types = allTypes[from];
			} else {
				if (lastAnchor) {
					types = lastAnchor.getAttribute(LINK_TYPES) ?? '';
				}
				allTypes[from] = types;
				sessionStorage.setItem(ALL_LINK_TYPES, JSON.stringify(allTypes));
			}
			const splitTypes = types.split(/\s*\/\s*/);
			if (from === to) {
				types = splitTypes[~~((splitTypes.length - 1) / 2)] ?? '';
			} else {
				types = splitTypes[splitTypes.length - 1] ?? '';
			}
		}
	}
	setViewTransitionTypes(types + " old", event);
};
addEventListener('pageswap', pageSwap);



const pageReveal = (event: PageRevealEvent) => {
	if (!event.viewTransition) return;
	const allTypes = JSON.parse(sessionStorage.getItem(ALL_LINK_TYPES) ?? '[]');
	let types = allTypes[to] ?? '';
	if (to < from) {
		const splitTypes = types.split(/\s*\/\s*/);
		types = splitTypes[0] ?? '';
	} else {
		const splitTypes = (allTypes[from] ?? '').split(/\s*\/\s*/);
		if (from === to) {
			types = splitTypes[~~((splitTypes.length - 1) / 2)] ?? '';
		} else {
			types = splitTypes[splitTypes.length - 1] ?? '';
		}
	}
	setViewTransitionTypes(types + " new", event);
};
addEventListener('pagereveal', pageReveal);

function setViewTransitionTypes(types: string, event: PageSwapEvent | PageRevealEvent) {
	const t = types.trim();
	t.length > 0 &&
		t.split(/\s+/).forEach((type) => event.viewTransition?.types?.add(type));
	return types;
}
