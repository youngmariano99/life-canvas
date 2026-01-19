import type { User } from '../../database/entities/user.entity';
export declare class FitnessActivity {
    id: string;
    userId: string;
    type: string;
    date: Date;
    duration: number;
    calories: number;
    distance: number;
    notes: string;
    createdAt: Date;
    user: User;
}
