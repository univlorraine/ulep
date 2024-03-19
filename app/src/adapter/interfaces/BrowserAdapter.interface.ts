
interface BrowserAdapterInterface {
    close: () => void;
    open: (url: string, windowName: string) => Promise<void>;
    openHref : (event: React.MouseEvent<HTMLElement>) => Promise<void>
}

export default BrowserAdapterInterface;
