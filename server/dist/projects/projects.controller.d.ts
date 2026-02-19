import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, req: any): Promise<import("./entities/project.entity").Project[]>;
    findAll(req: any, year?: number): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: string, req: any): Promise<import("./entities/project.entity").Project | null>;
    update(id: string, updateProjectDto: UpdateProjectDto, req: any): Promise<import("./entities/project.entity").Project | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
