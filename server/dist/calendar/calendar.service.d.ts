import { Repository } from 'typeorm';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { User } from '../database/entities/user.entity';
export declare class CalendarService {
    private calendarRepository;
    private userRepository;
    constructor(calendarRepository: Repository<CalendarEvent>, userRepository: Repository<User>);
    private getDemoUser;
    create(createDto: CreateCalendarEventDto): Promise<CalendarEvent>;
    findAll(): Promise<CalendarEvent[]>;
    findOne(id: string): Promise<CalendarEvent | null>;
    update(id: string, updateDto: UpdateCalendarEventDto): Promise<CalendarEvent | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
