interface CameraAdapterInterface {
    getPictureFromGallery: () => Promise<File | undefined>;
}

export default CameraAdapterInterface;
