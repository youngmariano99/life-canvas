import type { Project } from '../../projects/entities/project.entity';
import type { Role } from '../../roles/entities/role.entity';
export declare class ProjectActivity {
    id: string;
    projectId: string;
    title: string;
    status: string;
    sortOrder: number;
    dueDate: Date;
    roleId: string;
    createdAt: Date;
    project: Project;
    role: Role;
}
