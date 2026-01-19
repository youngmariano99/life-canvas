import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { User } from '../database/entities/user.entity';
export declare class ProjectsService {
    private projectRepository;
    private userRepository;
    constructor(projectRepository: Repository<Project>, userRepository: Repository<User>);
    private getDemoUser;
    create(createProjectDto: CreateProjectDto): Promise<Project[]>;
    findAll(): Promise<Project[]>;
    findOne(id: string): Promise<Project | null>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
