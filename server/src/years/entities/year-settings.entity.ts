import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Entity('year_settings')
export class YearSettings {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    year: number;

    @Column({ type: 'text', nullable: true })
    vision5Years: string;

    @Column("text", { array: true, nullable: true })
    visionImages: string[];

    @Column({ type: 'text', nullable: true })
    mission: string;

    @Column({ type: 'text', nullable: true })
    h1Priority: string;

    @Column({ type: 'text', nullable: true })
    h2Priority: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
