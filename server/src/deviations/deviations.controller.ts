import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeviationsService } from './deviations.service';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';

@Controller('deviations')
export class DeviationsController {
    constructor(private readonly deviationsService: DeviationsService) { }

    @Post()
    create(@Body() createDto: CreateDeviationDto) {
        return this.deviationsService.create(createDto);
    }

    @Get()
    findAll() {
        return this.deviationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.deviationsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateDeviationDto) {
        return this.deviationsService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.deviationsService.remove(id);
    }
}
