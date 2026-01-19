import type { User } from '../../database/entities/user.entity';
import type { Goal } from '../../goals/entities/goal.entity';
import type { Habit } from '../../habits/entities/habit.entity';
export declare class Role {
    id: string;
    userId: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    imageUrl: string;
    createdAt: Date;
    user: User;
    goals: Goal[];
    habits: Habit[];
}
