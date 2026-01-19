import { Repository } from 'typeorm';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
import { DailyStone } from './entities/daily-stone.entity';
import { User } from '../database/entities/user.entity';
export declare class DailyStonesService {
    private dailyStoneRepository;
    private userRepository;
    constructor(dailyStoneRepository: Repository<DailyStone>, userRepository: Repository<User>);
    private getDemoUser;
    findAll(): Promise<DailyStone[]>;
    upsert(dto: CreateDailyStoneDto): Promise<DailyStone>;
}
