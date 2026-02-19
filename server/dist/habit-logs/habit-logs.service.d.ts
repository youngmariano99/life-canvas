import { Repository } from 'typeorm';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { HabitLog } from './entities/habit-log.entity';
export declare class HabitLogsService {
    private habitLogRepository;
    constructor(habitLogRepository: Repository<HabitLog>);
    findAll(userId: string): Promise<HabitLog[]>;
    upsert(createHabitLogDto: CreateHabitLogDto, userId: string): Promise<HabitLog>;
}
