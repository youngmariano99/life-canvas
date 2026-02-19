import { Repository } from 'typeorm';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
export declare class CalendarService {
    private calendarRepository;
    constructor(calendarRepository: Repository<CalendarEvent>);
    create(createDto: CreateCalendarEventDto, userId: string): Promise<CalendarEvent>;
    findAll(userId: string): Promise<CalendarEvent[]>;
    findOne(id: string, userId: string): Promise<CalendarEvent | null>;
    update(id: string, updateDto: UpdateCalendarEventDto, userId: string): Promise<CalendarEvent | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
