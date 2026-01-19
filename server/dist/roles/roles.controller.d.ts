import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<import("./entities/role.entity").Role>;
    findAll(): Promise<import("./entities/role.entity").Role[]>;
    findOne(id: string): Promise<import("./entities/role.entity").Role | null>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<import("./entities/role.entity").Role | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
