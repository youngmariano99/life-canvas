import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
export declare class ProjectsService {
    private projectRepository;
    constructor(projectRepository: Repository<Project>);
    create(createProjectDto: CreateProjectDto, userId: string): Promise<Project[]>;
    findAll(userId: string, year?: number): Promise<Project[]>;
    findOne(id: string, userId: string): Promise<Project | null>;
    update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
