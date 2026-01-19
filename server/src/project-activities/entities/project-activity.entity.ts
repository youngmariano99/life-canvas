import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Project } from '../../projects/entities/project.entity';
import type { Role } from '../../roles/entities/role.entity';

@Entity('project_activities')
export class ProjectActivity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @Column({ length: 255 })
    title: string;

    @Column({ default: 'Por hacer', length: 100, nullable: true })
    status: string;

    @Column({ name: 'sort_order', default: 0, nullable: true })
    sortOrder: number;

    @Column({ name: 'due_date', type: 'date', nullable: true })
    dueDate: Date;

    @Column({ name: 'role_id', nullable: true })
    roleId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne('Project', (project: any) => project.activities, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne('Role', { nullable: true })
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
