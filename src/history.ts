const NAVIGATION = 'navigation';
const NAVIGATION_API = 'navigationAPI';
const SLOPPY_HISTORY = 'data-vtbag-sloppy-history';
const VTBAG_ID = 'vtbagId';
const VTBAG_ID_URL = 'vtbagIdURL';
const VTBAG_NAVIGATION_INDEX = 'vtbagNavigationIndex';
const VTBAG_NAVIGATION_HISTORY = 'vtbagNavigationHistory';
const VTBAG_NAVIGATION_TYPE = 'vtbagNavigationType';

export const navigationHistoryKind =
	NAVIGATION in window
		? NAVIGATION_API
		: document.querySelector(`script[${SLOPPY_HISTORY}]`)
			? VTBAG_ID
			: VTBAG_ID_URL;

export let lastIndex = -1;
export let currentIndex = -1;
export let navigationType = '';

let historyList: string[] = [];
let initialized = false;

export function initHistory() {
	if (initialized) return;
	initialized = true;
	addEventListener('pageswap', (e) =>
		sessionStorage.setItem(VTBAG_NAVIGATION_TYPE, e.activation.navigationType)
	);
	lastIndex = window?.navigation?.activation?.from?.index;
	currentIndex = window?.navigation?.activation?.entry?.index;
	if (navigationHistoryKind !== NAVIGATION_API) {
		const currentURL = (n: number | undefined) => {
			if (navigationHistoryKind === VTBAG_ID_URL) {
				const here = new URL(location.href);
				here.searchParams.set('vtbag', '' + n);
				return here.href;
			}
			return location.href + '§' + (n ?? '');
		};

		lastIndex = parseInt(sessionStorage.getItem(VTBAG_NAVIGATION_INDEX) ?? '-1', 10);
		navigationType = sessionStorage.getItem(VTBAG_NAVIGATION_TYPE) ?? '';
		historyList = JSON.parse(sessionStorage.getItem(VTBAG_NAVIGATION_HISTORY) ?? '[]');

		const vtbagId = history.state?.vtbagId;
		const current = currentURL(vtbagId);

		currentIndex = historyList.findIndex((e) => e === current);
		const bare = (url: string) => {
			const u = new URL(url, location.href);
			u.searchParams.delete('vtbag');
			return u.href;
		};

		if (currentIndex === -1) {
			historyList.splice(lastIndex + (bare(historyList[lastIndex]) === location.href ? 0 : 1));
			currentIndex = historyList.length;
			const here = currentURL(currentIndex);
			historyList.push(here);

			if (navigationHistoryKind === 'vtbagIdURL') {
				history.replaceState({ ...history.state, vtbagId: currentIndex }, '', here);
			} else {
				history.replaceState({ ...history.state, vtbagId: currentIndex }, '');
			}
			sessionStorage.setItem(VTBAG_NAVIGATION_HISTORY, JSON.stringify(historyList));
		}
		sessionStorage.setItem(VTBAG_NAVIGATION_INDEX, '' + currentIndex);
	}
}

// only works for navigationHistoryKind === 'vtbagIdURL'
// won't work but also unnecessary for navigationHistoryKind === 'navigationAPI'
// always wrong for navigationHistoryKind === 'vtbagId'
export function historyIndex(entry: string): number {
	return historyList.findIndex((e) => e === entry);
}

export const bare = (url: string) => {
	const u = new URL(url, location.href);
	u.searchParams.delete('vtbag');
	return u.href;
};
