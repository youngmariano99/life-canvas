import { Repository } from 'typeorm';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
import { DailyStone } from './entities/daily-stone.entity';
export declare class DailyStonesService {
    private dailyStoneRepository;
    constructor(dailyStoneRepository: Repository<DailyStone>);
    findAll(userId: string, year?: number): Promise<DailyStone[]>;
    upsert(dto: CreateDailyStoneDto, userId: string): Promise<DailyStone>;
}
