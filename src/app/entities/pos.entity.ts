import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { EntrepriseEntity } from "./entreprise.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class PosEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => EntrepriseEntity, (data) => data.pos)
    entreprise?: EntrepriseEntity;

    @Column()
    name: string = '';

    @Column()
    adresse: string = '';

    @Column()
    email: string = '';

    @Column()
    telephone: string = '';

    @Column()
    manager: string = '';

    @Column()
    status: boolean = false;

    @Column()
    signature: string = '';

    @OneToMany(() => UserEntity, (data) => data.pos)
    users: UserEntity[] = [];

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;
}
