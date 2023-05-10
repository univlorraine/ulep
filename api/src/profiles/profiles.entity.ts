import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('profile')
@Unique(['email'])
export default class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  gender: string;

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text')
  email: string;

  @Column('date')
  birthday: string;

  @Column('text', { nullable: true })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
