import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { EntrepriseEntity } from "./entreprise.entity";
import { PosEntity } from "./pos.entity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number; 

  @Column()
  fullname: string = '';

  @Column()
  email: string = '';

  @Column()
  telephone: string = '';

  @Column()
  password: string = '';

  // password_confirm: string;

  @Column()
  role: string = '';

  @Column()
  permission: string = '';


  @Column()
  status: boolean = false;

  @Column()
  currency: string = '';
 

  @ManyToOne(() => EntrepriseEntity, (data) => data.users)
  entreprise?: EntrepriseEntity;
 

  @ManyToOne(() => PosEntity, (data) => data.users)
  pos?: PosEntity;

  @Column()
  signature: string = '';

  @Column()
  created_at?: Date;

  @Column()
  updated_at?: Date;
}
