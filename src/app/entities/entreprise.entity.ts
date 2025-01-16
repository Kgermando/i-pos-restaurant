import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { PosEntity } from "./pos.entity";

@Entity()
export class EntrepriseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    type_entreprise: string = '';

    @Column()
    name: string = '';

    @Column()
    code: number = 0;

    @Column()
    rccm: string = '';

    @Column()
    idnat: string = '';

    @Column()
    email: string = '';

    @Column()
    telephone: string = '';

    @Column()
    manager: string = '';

    @Column()
    status: boolean = false;

    @Column()
    abonnement: Date = new Date();

    @Column()
    signature: string = '';

    @OneToMany(() => UserEntity, (data) => data.entreprise)
    users: UserEntity[] = [];
 
    @OneToMany(() => PosEntity, (data) => data.entreprise)
    pos: PosEntity[] = [];

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;
}
