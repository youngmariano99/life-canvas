import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    create(createDto: CreateCalendarEventDto, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent>;
    findAll(req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent[]>;
    findOne(id: string, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent | null>;
    update(id: string, updateDto: UpdateCalendarEventDto, req: any): Promise<import("./entities/calendar-event.entity").CalendarEvent | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
