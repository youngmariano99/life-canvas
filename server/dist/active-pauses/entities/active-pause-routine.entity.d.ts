import { User } from '../../database/entities/user.entity';
export declare class ActivePauseRoutineEntity {
    id: string;
    nombre: string;
    duracion: string;
    pasos: string[];
    nivel: string;
    zona: string[];
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
