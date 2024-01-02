class MediaObject {
  constructor(
    public readonly id: string,
    public readonly mimeType: string,
    public readonly url: string,
  ) {}
}

export default MediaObject;