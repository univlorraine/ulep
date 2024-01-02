import MediaObject from '../entities/MediaObject';

interface GetAvatarUsecaseInterface {
  execute(id: string, accessToken: string): Promise<MediaObject | Error>;
}
export default GetAvatarUsecaseInterface;
