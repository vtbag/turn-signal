import { sourceElement } from './source-element';
import {
	currentIndex,
	historyIndex,
	initHistory,
	lastIndex,
	navigationHistoryKind,
} from './history';
import { canDetectBackwardTraversal, isBackwardTraversal } from './backward-traversal';

const LINK_TYPES = 'data-vtbag-link-types';
const ALL_LINK_TYPES = 'vtbag-all-link-types';

const allTypes = JSON.parse(sessionStorage.getItem(ALL_LINK_TYPES) ?? '[]');

addEventListener('pageswap', (event) => {
	const lastAnchor = sourceElement();
	if (!event.viewTransition) return;

	let types = '';
	if (event.activation.navigationType === 'traverse') {
		if (canDetectBackwardTraversal(event)) {
			const back = isBackwardTraversal(event);
			const idx =
				navigationHistoryKind === 'navigationAPI'
					? back
						? event.activation.entry.index
						: event.activation.from.index
					: back
						? historyIndex(event.activation.entry.url ?? '')
						: currentIndex;
			types = allTypes[idx];
			if (back) {
				types.includes('/') && (types = types.split(/\s*\/\s*/, 2)[1]);
			} else {
				types.includes('/') && (types = types.split(/\s*\/\s*/, 1)[0]);
			}
		}
	} else {
		if (lastAnchor) {
			types = lastAnchor.getAttribute(LINK_TYPES) ?? '';
		}
		allTypes[currentIndex] = types;
		sessionStorage.setItem(ALL_LINK_TYPES, JSON.stringify(allTypes));
		types.includes('/') && (types = types.split(/\s*\/\s*/, 1)[0]);
	}
	setViewTransitionTypes(types, event);
});

addEventListener('pagereveal', (event) => {
	initHistory();
	if (!event.viewTransition) return;
	let types = allTypes[currentIndex] ?? '';
	if (isBackwardTraversal(event)) {
		types.includes('/') && (types = types.split(/\s*\/\s*/, 2)[1]);
	} else {
		if (
			navigationHistoryKind !== 'navigationAPI' ||
			window.navigation.activation.entry.url !== window.navigation.activation.from.url
		) {
			types = allTypes[lastIndex];
		}
		types.includes('/') && (types = types.split(/\s*\/\s*/, 1)[0]);
	}
	setViewTransitionTypes(types, event);
});

function setViewTransitionTypes(types: string, event: PageSwapEvent | PageRevealEvent) {
	types.trim().length > 0 &&
		types.split(/\s+/).forEach((type) => event.viewTransition?.types?.add(type));
	return types;
}
