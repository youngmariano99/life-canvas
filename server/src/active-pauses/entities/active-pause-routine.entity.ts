import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Entity('active_pause_routines')
export class ActivePauseRoutineEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    duracion: string;

    @Column('text', { array: true })
    pasos: string[];

    @Column()
    nivel: string; // "principiante" | "intermedio" | "avanzado"

    @Column('text', { array: true })
    zona: string[];

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
