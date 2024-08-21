interface BrowserAdapterInterface {
    close: () => Promise<void>;
    open: (url: string, windowName?: string) => Promise<void>;
    openLinkInBrowser: (event: React.MouseEvent<HTMLElement>) => Promise<void>;
}

export default BrowserAdapterInterface;
