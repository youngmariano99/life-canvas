import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(CalendarEvent)
        private calendarRepository: Repository<CalendarEvent>,
    ) { }

    async create(createDto: CreateCalendarEventDto, userId: string) {
        const rawStartDate = createDto.startDate || createDto.date;
        if (!rawStartDate) {
            throw new Error('Start date or date is required');
        }

        const startDate = typeof rawStartDate === 'string'
            ? new Date(rawStartDate)
            : rawStartDate;

        const endDate = createDto.endDate
            ? (typeof createDto.endDate === 'string' ? new Date(createDto.endDate) : createDto.endDate)
            : startDate; // Default to same day if no end date

        const event = this.calendarRepository.create({
            ...createDto,
            startDate,
            endDate,
            user: { id: userId } as any
        });
        return this.calendarRepository.save(event);
    }

    async findAll(userId: string) {
        return this.calendarRepository.find({
            where: { user: { id: userId } },
            order: { startDate: 'ASC' },
            take: 200
        });
    }

    async findOne(id: string, userId: string) {
        return this.calendarRepository.findOne({ where: { id, user: { id: userId } } });
    }

    async update(id: string, updateDto: UpdateCalendarEventDto, userId: string) {
        const event = await this.findOne(id, userId);
        if (!event) throw new Error(`Event ${id} not found`);

        const data: any = { ...updateDto };
        if (data.startDate && typeof data.startDate === 'string') {
            data.startDate = new Date(data.startDate);
        }
        if (data.endDate && typeof data.endDate === 'string') {
            data.endDate = new Date(data.endDate);
        }

        await this.calendarRepository.update(id, data);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const result = await this.calendarRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
