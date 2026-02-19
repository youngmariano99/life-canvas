import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
export declare class HabitLogsController {
    private readonly habitLogsService;
    constructor(habitLogsService: HabitLogsService);
    findAll(req: any): Promise<import("./entities/habit-log.entity").HabitLog[]>;
    upsert(createHabitLogDto: CreateHabitLogDto, req: any): Promise<import("./entities/habit-log.entity").HabitLog>;
}
