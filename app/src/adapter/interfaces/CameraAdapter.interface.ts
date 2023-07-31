interface CameraAdapterInterface {
    getPictureFromGallery: () => Promise<string | undefined>;
}

export default CameraAdapterInterface;
