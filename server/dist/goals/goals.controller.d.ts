import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    create(createGoalDto: CreateGoalDto, req: any): Promise<import("./entities/goal.entity").Goal[]>;
    findAll(req: any, year?: number): Promise<import("./entities/goal.entity").Goal[]>;
    findOne(id: string, req: any): Promise<import("./entities/goal.entity").Goal | null>;
    update(id: string, updateGoalDto: UpdateGoalDto, req: any): Promise<import("./entities/goal.entity").Goal>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
