const handleDownloadFile = async (url: string, fileName?: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName || 'true';
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export default handleDownloadFile;
