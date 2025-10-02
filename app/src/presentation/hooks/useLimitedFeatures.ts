const useLimitedFeatures = () => {
    const limitedFeatures: boolean = import.meta.env.VITE_LIMITED_FEATURES === 'true';
    return limitedFeatures;
};

export default useLimitedFeatures;
