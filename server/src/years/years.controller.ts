import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { YearsService } from './years.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('years')
export class YearsController {
    constructor(private readonly yearsService: YearsService) { }

    @Post('close')
    closeYear(@Body() body: { year: number }, @Request() req) {
        return this.yearsService.closeYear(body.year, req.user.id);
    }
}
