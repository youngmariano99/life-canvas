import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { User } from '../../database/entities/user.entity';
import type { Role } from '../../roles/entities/role.entity';
import type { Project } from '../../projects/entities/project.entity';
import type { Deviation } from '../../deviations/entities/deviation.entity';
import type { Resource } from '../../resources/entities/resource.entity';

@Entity('goals')
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'role_id' })
    roleId: string;

    @Column({ length: 255 })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'smallint', nullable: true })
    quarter: number;

    @Column({ type: 'smallint', nullable: true })
    semester: number;

    @Column({ name: 'target_date', type: 'date', nullable: true })
    targetDate: Date;

    @Column({ default: 'pending', length: 20, nullable: true })
    status: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne('User', (user: any) => user.goals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne('Role', (role: any) => role.goals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @OneToMany('Project', (project: any) => project.goal)
    projects: Project[];

    @OneToMany('Deviation', (deviation: any) => deviation.goal)
    deviations: Deviation[];

    @OneToMany('Resource', (resource: any) => resource.goal)
    resources: Resource[];
}
