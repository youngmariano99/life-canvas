import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectActivitiesService } from './project-activities.service';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';

@Controller('project-activities')
export class ProjectActivitiesController {
    constructor(private readonly projectActivitiesService: ProjectActivitiesService) { }

    @Post()
    create(@Body() createDto: CreateProjectActivityDto) {
        return this.projectActivitiesService.create(createDto);
    }

    @Get()
    findAll() {
        return this.projectActivitiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectActivitiesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateProjectActivityDto) {
        return this.projectActivitiesService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectActivitiesService.remove(id);
    }
}
