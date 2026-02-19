import type { Goal } from '../../goals/entities/goal.entity';
import type { ProjectActivity } from '../../project-activities/entities/project-activity.entity';
export declare class Project {
    id: string;
    goalId: string;
    name: string;
    year: number;
    description: string;
    dueDate: Date;
    statuses: string[];
    createdAt: Date;
    updatedAt: Date;
    goal: Goal;
    activities: ProjectActivity[];
}
