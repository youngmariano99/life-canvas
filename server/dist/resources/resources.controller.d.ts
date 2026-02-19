import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(createDto: CreateResourceDto, req: any): Promise<import("./entities/resource.entity").Resource>;
    findAll(req: any, year?: number): Promise<import("./entities/resource.entity").Resource[]>;
    findOne(id: string, req: any): Promise<import("./entities/resource.entity").Resource | null>;
    update(id: string, updateDto: UpdateResourceDto, req: any): Promise<import("./entities/resource.entity").Resource | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
