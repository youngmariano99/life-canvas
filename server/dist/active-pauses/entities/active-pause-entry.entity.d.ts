import { User } from '../../database/entities/user.entity';
import { ActivePauseRoutineEntity } from './active-pause-routine.entity';
export declare class ActivePauseEntryEntity {
    id: string;
    date: Date;
    routineId: string;
    routine: ActivePauseRoutineEntity;
    completed: boolean;
    waterIntake: boolean;
    eyeCare: boolean;
    user: User;
    userId: string;
    createdAt: Date;
}
