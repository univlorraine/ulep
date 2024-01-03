import MediaObject from "../entities/MediaObject";

interface GetMediaObjectUsecaseInterface {
  execute(id: string, accessToken: string): Promise<(MediaObject & { url: string; }) | Error>;
}

export default GetMediaObjectUsecaseInterface;
