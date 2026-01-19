import { Repository } from 'typeorm';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { HabitLog } from './entities/habit-log.entity';
import { User } from '../database/entities/user.entity';
export declare class HabitLogsService {
    private habitLogRepository;
    private userRepository;
    constructor(habitLogRepository: Repository<HabitLog>, userRepository: Repository<User>);
    private getDemoUser;
    findAll(): Promise<HabitLog[]>;
    upsert(createHabitLogDto: CreateHabitLogDto): Promise<HabitLog>;
}
