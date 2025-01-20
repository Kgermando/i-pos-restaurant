import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('numeric')
  userId: number = 0;

  @Column('string')
  token: string = '';

  @Column('date')
  createdAt?: Date;
}
