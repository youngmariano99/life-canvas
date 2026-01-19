import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Post()
    create(@Body() createDto: CreateCalendarEventDto) {
        return this.calendarService.create(createDto);
    }

    @Get()
    findAll() {
        return this.calendarService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.calendarService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateCalendarEventDto) {
        return this.calendarService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.calendarService.remove(id);
    }
}
