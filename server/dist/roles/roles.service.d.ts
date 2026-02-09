import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { User } from '../database/entities/user.entity';
export declare class RolesService {
    private roleRepository;
    private userRepository;
    constructor(roleRepository: Repository<Role>, userRepository: Repository<User>);
    private getDemoUser;
    create(createRoleDto: CreateRoleDto): Promise<Role>;
    findAll(): Promise<Role[]>;
    findOne(id: string): Promise<Role | null>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
