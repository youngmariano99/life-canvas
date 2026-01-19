import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Post()
    create(@Body() createDto: CreateResourceDto) {
        return this.resourcesService.create(createDto);
    }

    @Get()
    findAll() {
        return this.resourcesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resourcesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateResourceDto) {
        return this.resourcesService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.resourcesService.remove(id);
    }
}
