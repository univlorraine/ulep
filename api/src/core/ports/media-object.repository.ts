import { LearningObjective, MediaObject, User } from '../models';

export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

export interface MediaObjectRepository {
  avatarOfUser(userId: string): Promise<MediaObject | null>;

  saveAvatar: (user: User, object: MediaObject) => Promise<void>;

  saveObjectiveImage: (
    objective: LearningObjective,
    object: MediaObject,
  ) => Promise<void>;

  findOne(id: string): Promise<MediaObject | null>;

  remove(id: string): Promise<void>;
}
