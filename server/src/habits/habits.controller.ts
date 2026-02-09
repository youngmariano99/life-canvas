import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('habits')
export class HabitsController {
    constructor(private readonly habitsService: HabitsService) { }

    @Post()
    create(@Body() createHabitDto: CreateHabitDto, @Request() req) {
        return this.habitsService.create(createHabitDto, req.user.id);
    }

    @Get()
    findAll(@Request() req, @Query('year') year?: number) {
        return this.habitsService.findAll(req.user.id, year);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.habitsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto, @Request() req) {
        return this.habitsService.update(id, updateHabitDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.habitsService.remove(id, req.user.id);
    }
}
