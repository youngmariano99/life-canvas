import { Controller, Get, Post, Body } from '@nestjs/common';
import { DailyStonesService } from './daily-stones.service';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';

@Controller('daily-stones')
export class DailyStonesController {
    constructor(private readonly dailyStonesService: DailyStonesService) { }

    @Get()
    findAll() {
        return this.dailyStonesService.findAll();
    }

    @Post()
    upsert(@Body() createDailyStoneDto: CreateDailyStoneDto) {
        return this.dailyStonesService.upsert(createDailyStoneDto);
    }
}
