import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { PosEntity } from "./pos.entity";

@Entity()
export class EntrepriseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('string')
    type_entreprise: string = '';

    @Column('string')
    name: string = '';

    @Column('string')
    code: string = '';

    @Column('string')
    rccm: string = '';

    @Column('string')
    idnat: string = '';

    @Column('string')
    email: string = '';

    @Column('string')
    telephone: string = '';

    @Column('string')
    manager: string = '';

    @Column('boolean')
    status: boolean = false;

    @Column('date')
    abonnement: Date = new Date();

    @Column('string')
    signature: string = '';

    @OneToMany(() => UserEntity, (data) => data.entreprise)
    users?: UserEntity[] = [];
 
    @OneToMany(() => PosEntity, (data) => data.entreprise)
    pos?: PosEntity[] = [];

    @Column('date')
    created_at?: Date;

    @Column('date')
    updated_at?: Date;
}
