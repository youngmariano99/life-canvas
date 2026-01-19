import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(createDto: CreateResourceDto): Promise<import("./entities/resource.entity").Resource>;
    findAll(): Promise<import("./entities/resource.entity").Resource[]>;
    findOne(id: string): Promise<import("./entities/resource.entity").Resource | null>;
    update(id: string, updateDto: UpdateResourceDto): Promise<import("./entities/resource.entity").Resource | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
