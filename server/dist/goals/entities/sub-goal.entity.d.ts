import type { Goal } from './goal.entity';
export declare class SubGoal {
    id: string;
    goalId: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    goal: Goal;
}
