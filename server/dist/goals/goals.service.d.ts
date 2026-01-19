import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { User } from '../database/entities/user.entity';
export declare class GoalsService {
    private goalRepository;
    private userRepository;
    constructor(goalRepository: Repository<Goal>, userRepository: Repository<User>);
    private getDemoUser;
    create(createGoalDto: CreateGoalDto): Promise<Goal[]>;
    findAll(): Promise<Goal[]>;
    findOne(id: string): Promise<Goal | null>;
    update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
