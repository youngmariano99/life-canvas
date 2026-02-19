import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
export declare class RolesService {
    private roleRepository;
    constructor(roleRepository: Repository<Role>);
    create(createRoleDto: CreateRoleDto, userId: string): Promise<Role>;
    findAll(userId: string): Promise<Role[]>;
    findOne(id: string, userId: string): Promise<Role | null>;
    update(id: string, updateRoleDto: UpdateRoleDto, userId: string): Promise<Role>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
