import type { User } from '../../database/entities/user.entity';
export declare class FitnessRoutine {
    id: string;
    userId: string;
    name: string;
    type: string;
    structureType: string;
    rounds: string;
    content: any;
    createdAt: Date;
    user: User;
}
