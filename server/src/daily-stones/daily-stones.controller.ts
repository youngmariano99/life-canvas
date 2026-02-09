import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { DailyStonesService } from './daily-stones.service';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('daily-stones')
export class DailyStonesController {
    constructor(private readonly dailyStonesService: DailyStonesService) { }

    @Get()
    findAll(@Request() req, @Query('year') year?: number) {
        return this.dailyStonesService.findAll(req.user.id, year);
    }

    @Post()
    upsert(@Body() createDailyStoneDto: CreateDailyStoneDto, @Request() req) {
        return this.dailyStonesService.upsert(createDailyStoneDto, req.user.id);
    }
}
