import { Controller, Get, Post, Body } from '@nestjs/common';
import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';

@Controller('habit-logs')
export class HabitLogsController {
    constructor(private readonly habitLogsService: HabitLogsService) { }

    @Get()
    findAll() {
        return this.habitLogsService.findAll();
    }

    @Post()
    upsert(@Body() createHabitLogDto: CreateHabitLogDto) {
        return this.habitLogsService.upsert(createHabitLogDto);
    }
}
