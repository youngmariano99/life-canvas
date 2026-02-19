import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
export declare class ProjectActivitiesController {
    private readonly projectActivitiesService;
    constructor(projectActivitiesService: ProjectActivitiesService);
    create(createDto: CreateProjectActivityDto, req: any): Promise<import("./entities/project-activity.entity").ProjectActivity[]>;
    findAll(req: any): Promise<import("./entities/project-activity.entity").ProjectActivity[]>;
    findOne(id: string, req: any): Promise<import("./entities/project-activity.entity").ProjectActivity | null>;
    update(id: string, updateDto: UpdateProjectActivityDto, req: any): Promise<import("./entities/project-activity.entity").ProjectActivity | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
