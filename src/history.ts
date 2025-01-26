export let navigationType: NavigationTypeString | null;
export let from: number;
export let fromUrl: string | null;
export let to: number;
export let toUrl: string | null;

const pageReveal = (e: PageRevealEvent) => {
	history.state?.vtbagId ?? history.replaceState({ vtbagId: history.length }, '');
	from = parseInt(sessionStorage.getItem('vtbag-id') ?? "NaN", 10);
	to = history.state.vtbagId;
	navigationType = sessionStorage.getItem('vtbag-navigation-type') as NavigationTypeString;
	sessionStorage.setItem('vtbag-id', '' + to);
	fromUrl = sessionStorage.getItem('vtbag-from');
	toUrl = sessionStorage.getItem('vtbag-to');
};
addEventListener('pagereveal', pageReveal);

const pageSwap = (e:PageSwapEvent) => {
	if (!e.activation) return;
	navigationType = e.activation.navigationType;
	fromUrl = e.activation.from?.url ?? '';
	toUrl = e.activation.entry.url ?? '';
	from = history.state?.vtbagId;
	to =
		navigationType === 'push'
			? from + (fromUrl === toUrl ? 0 : 1)
			: navigationType === 'replace'
				? from
				: e.activation.entry.index !== -1
					? from + (e.activation.entry.index - (e.activation.from?.index??-1))
					: NaN;
	sessionStorage.setItem('vtbag-navigation-type', navigationType);
	sessionStorage.setItem('vtbag-from', fromUrl);
	sessionStorage.setItem('vtbag-to', toUrl);
}
addEventListener('pageswap', pageSwap);