import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../../category/typeorm/model/category.entity';
import { Document } from '../../../organization/typeorm/model/document.entity';
import { User } from '../../../user/typeorm/model/user.entity';

@Entity({ name: 'organizations' })
export class Organization {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'legalName' })
    legalName: string;

    @Column({ name: 'address' })
    address: string;

    @Column({ name: 'cuit' })
    cuit: string;

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'organization_categories',
        joinColumn: {
            name: "organization_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    categories: Category[];

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'organization_subcategories',
        joinColumn: {
            name: "organization_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    subcategories: Category[];

    @Column({ name: 'phone' })
    phone: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner' })
    owner: User;

    @ManyToMany(() => User)
    @JoinTable({
        name: 'organization_users',
        joinColumn: {
            name: "organization_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    operators: User[];

    @OneToMany(() => Document, document => document.organization)
    supportingDocumentation: Document[];

    @Column({ name: 'status' })
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'validator' })
    validator: User;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    deletedAt: Date;
}
