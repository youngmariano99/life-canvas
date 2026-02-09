import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('resources')
export class ResourcesController {
    constructor(private readonly resourcesService: ResourcesService) { }

    @Post()
    create(@Body() createDto: CreateResourceDto, @Request() req) {
        return this.resourcesService.create(createDto, req.user.id);
    }

    @Get()
    findAll(@Request() req, @Query('year') year?: number) {
        return this.resourcesService.findAll(req.user.id, year);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.resourcesService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateResourceDto, @Request() req) {
        return this.resourcesService.update(id, updateDto, req.user.id);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.resourcesService.remove(id, req.user.id);
    }
}
