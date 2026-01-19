import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    create(createGoalDto: CreateGoalDto): Promise<import("./entities/goal.entity").Goal[]>;
    findAll(): Promise<import("./entities/goal.entity").Goal[]>;
    findOne(id: string): Promise<import("./entities/goal.entity").Goal | null>;
    update(id: string, updateGoalDto: UpdateGoalDto): Promise<import("./entities/goal.entity").Goal | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
