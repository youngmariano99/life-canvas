import type { User } from '../../database/entities/user.entity';
import type { Goal } from '../../goals/entities/goal.entity';
export declare class Deviation {
    id: string;
    userId: string;
    goalId: string;
    title: string;
    reason: string;
    correction: string;
    date: Date;
    createdAt: Date;
    user: User;
    goal: Goal;
}
