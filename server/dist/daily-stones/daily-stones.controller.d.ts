import { DailyStonesService } from './daily-stones.service';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
export declare class DailyStonesController {
    private readonly dailyStonesService;
    constructor(dailyStonesService: DailyStonesService);
    findAll(req: any, year?: number): Promise<import("./entities/daily-stone.entity").DailyStone[]>;
    upsert(createDailyStoneDto: CreateDailyStoneDto, req: any): Promise<import("./entities/daily-stone.entity").DailyStone>;
}
