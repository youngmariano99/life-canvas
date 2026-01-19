import { DailyStonesService } from './daily-stones.service';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
export declare class DailyStonesController {
    private readonly dailyStonesService;
    constructor(dailyStonesService: DailyStonesService);
    findAll(): Promise<import("./entities/daily-stone.entity").DailyStone[]>;
    upsert(createDailyStoneDto: CreateDailyStoneDto): Promise<import("./entities/daily-stone.entity").DailyStone>;
}
