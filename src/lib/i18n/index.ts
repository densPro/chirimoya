import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));
register('es', () => import('./locales/es.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser
		? (localStorage.getItem('locale') || window.navigator.language.split('-')[0])
		: defaultLocale
});
