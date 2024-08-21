import { Browser } from '@capacitor/browser';
import BrowserAdapterInterface from './interfaces/BrowserAdapter.interface';

class BrowserAdapter implements BrowserAdapterInterface {
    close = async () => Browser.close();
    open = async (url: string, windowName: string = '_blank') => Browser.open({ url, windowName });
    openLinkInBrowser = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        return this.open((event.target as HTMLAnchorElement).href);
    };
}

export default BrowserAdapter;
