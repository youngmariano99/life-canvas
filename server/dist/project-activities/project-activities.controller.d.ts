import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
export declare class ProjectActivitiesController {
    private readonly projectActivitiesService;
    constructor(projectActivitiesService: ProjectActivitiesService);
    create(createDto: CreateProjectActivityDto): Promise<import("./entities/project-activity.entity").ProjectActivity[]>;
    findAll(): Promise<import("./entities/project-activity.entity").ProjectActivity[]>;
    findOne(id: string): Promise<import("./entities/project-activity.entity").ProjectActivity | null>;
    update(id: string, updateDto: UpdateProjectActivityDto): Promise<import("./entities/project-activity.entity").ProjectActivity | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
