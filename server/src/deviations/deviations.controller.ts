import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { DeviationsService } from './deviations.service';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('deviations')
export class DeviationsController {
    constructor(private readonly deviationsService: DeviationsService) { }

    @Post()
    create(@Body() createDto: CreateDeviationDto, @Request() req) {
        return this.deviationsService.create(createDto, req.user.id);
    }

    @Get()
    findAll(@Request() req, @Query('year') year?: number) {
        return this.deviationsService.findAll(req.user.id, year);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.deviationsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateDeviationDto, @Request() req) {
        return this.deviationsService.update(id, updateDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.deviationsService.remove(id, req.user.id);
    }
}
