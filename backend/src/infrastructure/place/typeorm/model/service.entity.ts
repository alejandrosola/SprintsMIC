import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./place.entity";

@Entity({ name: 'services' })
export class Service {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}