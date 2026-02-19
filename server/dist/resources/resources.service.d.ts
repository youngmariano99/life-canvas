import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
export declare class ResourcesService {
    private resourceRepository;
    constructor(resourceRepository: Repository<Resource>);
    create(createDto: CreateResourceDto, userId: string): Promise<Resource>;
    findAll(userId: string, year?: number): Promise<Resource[]>;
    findOne(id: string, userId: string): Promise<Resource | null>;
    update(id: string, updateDto: UpdateResourceDto, userId: string): Promise<Resource | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
