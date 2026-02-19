import { Repository } from 'typeorm';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
import { ProjectActivity } from './entities/project-activity.entity';
export declare class ProjectActivitiesService {
    private projectActivityRepository;
    constructor(projectActivityRepository: Repository<ProjectActivity>);
    create(createDto: CreateProjectActivityDto, userId: string): Promise<ProjectActivity[]>;
    findAll(userId: string): Promise<ProjectActivity[]>;
    findOne(id: string, userId: string): Promise<ProjectActivity | null>;
    update(id: string, updateDto: UpdateProjectActivityDto, userId: string): Promise<ProjectActivity | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
