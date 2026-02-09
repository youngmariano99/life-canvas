import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('goals')
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Post()
    create(@Body() createGoalDto: CreateGoalDto, @Request() req) {
        return this.goalsService.create(createGoalDto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.goalsService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.goalsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @Request() req) {
        return this.goalsService.update(id, updateGoalDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.goalsService.remove(id, req.user.id);
    }
}
