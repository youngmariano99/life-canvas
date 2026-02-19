import type { Goal } from '../../goals/entities/goal.entity';
export declare class Resource {
    id: string;
    goalId: string;
    name: string;
    year: number;
    quantityHave: number;
    quantityNeeded: number;
    unit: string;
    createdAt: Date;
    goal: Goal;
}
