import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { User } from '../database/entities/user.entity';
export declare class ResourcesService {
    private resourceRepository;
    private userRepository;
    constructor(resourceRepository: Repository<Resource>, userRepository: Repository<User>);
    private getDemoUser;
    create(createDto: CreateResourceDto): Promise<Resource>;
    findAll(): Promise<Resource[]>;
    findOne(id: string): Promise<Resource | null>;
    update(id: string, updateDto: UpdateResourceDto): Promise<Resource | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
