import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { EntrepriseEntity } from "./entreprise.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class PosEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => EntrepriseEntity, (data) => data.pos)
    entreprise?: EntrepriseEntity;

    @Column('string')
    name: string = '';

    @Column('string')
    adresse: string = '';

    @Column('string')
    email: string = '';

    @Column('string')
    telephone: string = '';

    @Column('string')
    manager: string = '';

    @Column('boolean')
    status: boolean = false;

    @Column('string')
    signature: string = '';

    @OneToMany(() => UserEntity, (data) => data.pos)
    users: UserEntity[] = [];

    @Column('date')
    created_at?: Date;

    @Column('date')
    updated_at?: Date;
}
