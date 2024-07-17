import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { App, URLOpenListenerEvent } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
    let history = useHistory();
    const matomoURL = import.meta.env.VITE_MATOMO_URL;
    useEffect(() => {
        // Init app URL Listener
        App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
            const slug = event.url.split('ulep://').pop();
            if (slug) {
                history.push(slug);
            }
        });

        // Init matomo
        if (matomoURL) {
            var _mtm = (window._mtm = window._mtm || []);
            var _paq = (window._paq = window._paq || []);
            _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });
            var d = document,
                g = d.createElement('script'),
                s = d.getElementsByTagName('script')[0];
            g.async = true;
            g.src = matomoURL;
            s.parentNode?.insertBefore(g, s);
        }
    }, []);

    // init URL listener Matomo
    useEffect(() => {
        if (!matomoURL) {
            return;
        }
        const unlisten = history.listen((location) => {
            window._paq.push(['setCustomUrl', location.pathname]);
            window._paq.push(['trackPageView']);
        });

        return () => {
            unlisten();
        };
    }, [history]);

    return null;
};

export default AppUrlListener;
