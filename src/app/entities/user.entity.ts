import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { EntrepriseEntity } from "./entreprise.entity";
import { PosEntity } from "./pos.entity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number; 

  @Column('string')
  fullname: string = '';

  @Column('string')
  email: string = '';

  @Column('string')
  telephone: string = '';

  @Column('md5')
  password?: string;

  // password_confirm: string;

  @Column('string')
  role: string = '';

  @Column('string')
  permission: string = '';


  @Column('boolean')
  status: boolean = false;

  @Column('string')
  currency: string = '';
 
  @ManyToOne(() => EntrepriseEntity, (data) => data.users)
  entreprise?: EntrepriseEntity;
 

  @ManyToOne(() => PosEntity, (data) => data.users)
  pos?: PosEntity;

  @Column('string')
  signature: string = '';

  @Column('date')
  created_at?: Date;

  @Column('date')
  updated_at?: Date;
}
