import { currentIndex, historyIndex, lastIndex, navigationHistoryKind } from './history';

export function canDetectBackwardTraversal(event?: PageSwapEvent | PageRevealEvent) {
	return navigationHistoryKind !== 'vtbagId' || event?.type === 'pagereveal';
}

export function isBackwardTraversal(event: PageSwapEvent | PageRevealEvent) {
	let fromIndex = lastIndex;
	let toIndex = currentIndex;
	switch (navigationHistoryKind) {
		case 'navigationAPI':
			const activation =
				event.type === 'pageswap'
					? (event as PageSwapEvent).activation
					: window.navigation.activation;
			fromIndex = activation.from.index;
			toIndex = activation.entry.index;
			break;
		case 'vtbagIdURL':
		case 'vtbagId':
			if (event?.type === 'pageswap') {
				const activation = (event as PageSwapEvent).activation;
				if (activation.navigationType !== 'traverse') return false;
				fromIndex = currentIndex;
				toIndex = historyIndex(activation.entry.url ?? '');
			}
	}
	return fromIndex !== -1 && toIndex !== -1 && toIndex < fromIndex;
}
