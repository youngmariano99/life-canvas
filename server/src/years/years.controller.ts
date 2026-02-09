import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { YearsService } from './years.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('years')
export class YearsController {
    constructor(private readonly yearsService: YearsService) { }

    @Get('settings')
    getSettings(@Query('year') year: string, @Request() req) {
        return this.yearsService.getSettings(parseInt(year), req.user.id);
    }

    @Post('settings')
    updateSettings(@Body() body: { year: number, settings: any }, @Request() req) {
        return this.yearsService.updateSettings(body.year, req.user.id, body.settings);
    }

    @Post('close')
    closeYear(@Body() body: { year: number }, @Request() req) {
        return this.yearsService.closeYear(body.year, req.user.id);
    }
}
