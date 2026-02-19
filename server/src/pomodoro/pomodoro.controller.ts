
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { Pomodoro } from './pomodoro.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('pomodoros')
@UseGuards(AuthGuard('jwt'))
export class PomodoroController {
    constructor(private readonly pomodoroService: PomodoroService) { }

    @Post()
    create(@Request() req, @Body() createPomodoroDto: Partial<Pomodoro>) {
        return this.pomodoroService.create(req.user.userId, createPomodoroDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.pomodoroService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.pomodoroService.findOne(req.user.userId, id);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.pomodoroService.remove(req.user.userId, id);
    }
}
