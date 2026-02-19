import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto, req: any): Promise<import("./entities/role.entity").Role>;
    findAll(req: any): Promise<import("./entities/role.entity").Role[]>;
    findOne(id: string, req: any): Promise<import("./entities/role.entity").Role | null>;
    update(id: string, updateRoleDto: UpdateRoleDto, req: any): Promise<import("./entities/role.entity").Role>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
