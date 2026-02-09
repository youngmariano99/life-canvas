import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('project-activities')
export class ProjectActivitiesController {
    constructor(private readonly projectActivitiesService: ProjectActivitiesService) { }

    @Post()
    create(@Body() createDto: CreateProjectActivityDto, @Request() req) {
        return this.projectActivitiesService.create(createDto, req.user.id);
    }

    @Get()
    findAll(@Request() req) {
        return this.projectActivitiesService.findAll(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.projectActivitiesService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateProjectActivityDto, @Request() req) {
        return this.projectActivitiesService.update(id, updateDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.projectActivitiesService.remove(id, req.user.id);
    }
}
