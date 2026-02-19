import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { SubGoal } from './entities/sub-goal.entity';
export declare class GoalsService {
    private goalRepository;
    private subGoalRepository;
    constructor(goalRepository: Repository<Goal>, subGoalRepository: Repository<SubGoal>);
    create(createGoalDto: CreateGoalDto, userId: string): Promise<Goal[]>;
    findAll(userId: string, year?: number): Promise<Goal[]>;
    findOne(id: string, userId: string): Promise<Goal | null>;
    update(id: string, updateGoalDto: UpdateGoalDto, userId: string): Promise<Goal>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
