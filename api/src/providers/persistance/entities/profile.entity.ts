import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
@Unique(['email'])
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  email: string;

  public static create(email: string): ProfileEntity {
    const profile = new ProfileEntity();
    profile.email = email;

    return profile;
  }
}
