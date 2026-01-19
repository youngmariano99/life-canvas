import { Repository } from 'typeorm';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
import { ProjectActivity } from './entities/project-activity.entity';
import { User } from '../database/entities/user.entity';
export declare class ProjectActivitiesService {
    private projectActivityRepository;
    private userRepository;
    constructor(projectActivityRepository: Repository<ProjectActivity>, userRepository: Repository<User>);
    private getDemoUser;
    create(createDto: CreateProjectActivityDto): Promise<ProjectActivity[]>;
    findAll(): Promise<ProjectActivity[]>;
    findOne(id: string): Promise<ProjectActivity | null>;
    update(id: string, updateDto: UpdateProjectActivityDto): Promise<ProjectActivity | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
