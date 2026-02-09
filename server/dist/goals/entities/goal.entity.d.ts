import type { User } from '../../database/entities/user.entity';
import type { Role } from '../../roles/entities/role.entity';
import type { Project } from '../../projects/entities/project.entity';
import type { Deviation } from '../../deviations/entities/deviation.entity';
import type { Resource } from '../../resources/entities/resource.entity';
import type { SubGoal } from './sub-goal.entity';
export declare class Goal {
    id: string;
    userId: string;
    roleId: string;
    title: string;
    description: string;
    quarter: number;
    semester: number;
    targetDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    role: Role;
    projects: Project[];
    deviations: Deviation[];
    resources: Resource[];
    subGoals: SubGoal[];
}
