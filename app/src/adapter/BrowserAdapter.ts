import { Browser } from '@capacitor/browser';
import BrowserAdapterInterface from './interfaces/BrowserAdapter.interface';

class BrowserAdapter implements BrowserAdapterInterface {
    close = async () => await Browser.close();
    open = async (url: string, windowName: string = '_blank') => await Browser.open({ url, windowName });
    openLinkInBrowser = async (event: React.MouseEvent<HTMLElement>): Promise<void> => {
        event.preventDefault();
        await this.open((event.target as HTMLAnchorElement).href);
    };
}

export default BrowserAdapter;
