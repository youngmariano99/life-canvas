import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { HabitLogsService } from './habit-logs.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('habit-logs')
export class HabitLogsController {
    constructor(private readonly habitLogsService: HabitLogsService) { }

    @Get()
    findAll(@Request() req) {
        return this.habitLogsService.findAll(req.user.id);
    }

    @Post()
    upsert(@Body() createHabitLogDto: CreateHabitLogDto, @Request() req) {
        return this.habitLogsService.upsert(createHabitLogDto, req.user.id);
    }
}
