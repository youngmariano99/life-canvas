import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';

@Controller('fitness')
export class FitnessController {
    constructor(private readonly fitnessService: FitnessService) { }

    // --- Routines ---

    @Post('routines')
    createRoutine(@Body() createDto: CreateFitnessRoutineDto) {
        return this.fitnessService.createRoutine(createDto);
    }

    @Get('routines')
    findAllRoutines() {
        return this.fitnessService.findAllRoutines();
    }

    @Delete('routines/:id')
    deleteRoutine(@Param('id') id: string) {
        return this.fitnessService.deleteRoutine(id);
    }

    // --- Activities ---

    @Post()
    create(@Body() createDto: CreateFitnessActivityDto) {
        return this.fitnessService.create(createDto);
    }

    @Get()
    findAll() {
        return this.fitnessService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fitnessService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateFitnessActivityDto) {
        return this.fitnessService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fitnessService.remove(id);
    }
}
