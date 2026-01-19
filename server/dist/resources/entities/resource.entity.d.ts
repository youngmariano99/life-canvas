import type { Goal } from '../../goals/entities/goal.entity';
export declare class Resource {
    id: string;
    goalId: string;
    title: string;
    type: string;
    url: string;
    description: string;
    createdAt: Date;
    goal: Goal;
}
