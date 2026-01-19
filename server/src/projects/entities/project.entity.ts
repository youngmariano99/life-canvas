import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { Goal } from '../../goals/entities/goal.entity';
import type { ProjectActivity } from '../../project-activities/entities/project-activity.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'goal_id' })
    goalId: string;

    @Column({ length: 255 })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'due_date', type: 'date', nullable: true })
    dueDate: Date;

    @Column('text', { array: true, default: ["Por hacer", "En progreso", "En revisión", "Completada"] })
    statuses: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne('Goal', (goal: any) => goal.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'goal_id' })
    goal: Goal;

    @OneToMany('ProjectActivity', (activity: any) => activity.project)
    activities: ProjectActivity[];
}
