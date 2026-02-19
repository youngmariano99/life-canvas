import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ActivePauseService } from './active-pauses.service';
import { CreateActivePauseRoutineDto, UpdateActivePauseRoutineDto, CreateActivePauseEntryDto } from './dto/active-pause.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('active-pauses')
@UseGuards(JwtAuthGuard)
export class ActivePauseController {
    constructor(private readonly activePauseService: ActivePauseService) { }

    // Routines
    @Post('routines')
    createRoutine(@Request() req, @Body() createDto: CreateActivePauseRoutineDto) {
        return this.activePauseService.createRoutine(req.user.userId, createDto);
    }

    @Get('routines')
    findAllRoutines(@Request() req) {
        return this.activePauseService.findAllRoutines(req.user.userId);
    }

    @Patch('routines/:id')
    updateRoutine(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateActivePauseRoutineDto) {
        return this.activePauseService.updateRoutine(req.user.userId, id, updateDto);
    }

    @Delete('routines/:id')
    removeRoutine(@Request() req, @Param('id') id: string) {
        return this.activePauseService.removeRoutine(req.user.userId, id);
    }

    // Entries
    @Post('entries')
    createEntry(@Request() req, @Body() createDto: CreateActivePauseEntryDto) {
        return this.activePauseService.createEntry(req.user.userId, createDto);
    }

    @Get('entries')
    findAllEntries(@Request() req) {
        return this.activePauseService.findAllEntries(req.user.userId);
    }
}
