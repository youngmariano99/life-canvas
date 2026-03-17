import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FitnessService } from './fitness.service';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { CreateTrainingBlockDto, UpdateTrainingBlockDto } from './dto/training-block.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('fitness')
export class FitnessController {
    constructor(private readonly fitnessService: FitnessService) { }

    // --- Routines ---

    @Post('routines')
    createRoutine(@Body() createDto: CreateFitnessRoutineDto, @Request() req) {
        return this.fitnessService.createRoutine(createDto, req.user.id);
    }

    @Get('routines')
    findAllRoutines(@Request() req) {
        return this.fitnessService.findAllRoutines(req.user.id);
    }

    @Delete('routines/:id')
    deleteRoutine(@Param('id') id: string, @Request() req) {
        return this.fitnessService.deleteRoutine(id, req.user.id);
    }

    // --- Activities ---

    @Post()
    create(@Body() createDto: CreateFitnessActivityDto, @Request() req) {
        return this.fitnessService.create(createDto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.fitnessService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.fitnessService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateFitnessActivityDto, @Request() req) {
        return this.fitnessService.update(id, updateDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.fitnessService.remove(id, req.user.id);
    }

    // --- Exercises ---

    @Get('exercises')
    findAllExercises(@Request() req) {
        return this.fitnessService.findAllExercises(req.user.id);
    }

    @Post('exercises')
    createExercise(@Body() createDto: CreateExerciseDto, @Request() req) {
        return this.fitnessService.createExercise(createDto, req.user.id);
    }

    @Patch('exercises/:id')
    updateExercise(@Param('id') id: string, @Body() updateDto: UpdateExerciseDto, @Request() req) {
        return this.fitnessService.updateExercise(id, updateDto, req.user.id);
    }

    @Delete('exercises/:id')
    deleteExercise(@Param('id') id: string, @Request() req) {
        return this.fitnessService.deleteExercise(id, req.user.id);
    }

    // --- Training Blocks ---

    @Get('blocks')
    findAllBlocks(@Request() req) {
        return this.fitnessService.findAllBlocks(req.user.id);
    }

    @Post('blocks')
    createBlock(@Body() createDto: CreateTrainingBlockDto, @Request() req) {
        return this.fitnessService.createBlock(createDto, req.user.id);
    }

    @Patch('blocks/:id')
    updateBlock(@Param('id') id: string, @Body() updateDto: UpdateTrainingBlockDto, @Request() req) {
        return this.fitnessService.updateBlock(id, updateDto, req.user.id);
    }

    @Delete('blocks/:id')
    deleteBlock(@Param('id') id: string, @Request() req) {
        return this.fitnessService.deleteBlock(id, req.user.id);
    }
}
