import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Place } from "./place.entity";

@Entity({ name: 'accessibilities' })
export class Accessibility {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}