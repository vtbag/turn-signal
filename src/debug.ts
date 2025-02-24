import { from, fromUrl, navigationType, to, toUrl } from './history';
import './index';

addEventListener('pagereveal', (e) => {
	console.log('pagereveal', navigationType?.slice(0, 4), from, fromUrl);
	console.log('          ', '->  ', to, toUrl);
	e.viewTransition && console.log('types: ', ...(e.viewTransition?.types ?? []));
});

addEventListener('pageswap', (e) => {
	console.log('pageswap  ', navigationType?.slice(0, 4), from, fromUrl);
	console.log('          ', '->  ', to, toUrl);
	e.viewTransition && console.log('types:', ...(e.viewTransition.types ?? []));
});
