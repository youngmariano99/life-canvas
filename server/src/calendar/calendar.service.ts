import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from './entities/calendar-event.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(CalendarEvent)
        private calendarRepository: Repository<CalendarEvent>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    private async getDemoUser() {
        let user = await this.userRepository.findOne({ where: { email: 'demo@lifecanvas.com' } });
        if (!user) {
            user = this.userRepository.create({
                email: 'demo@lifecanvas.com',
                name: 'Demo User',
            });
            await this.userRepository.save(user);
        }
        return user;
    }

    async create(createDto: CreateCalendarEventDto) {
        const user = await this.getDemoUser();

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
            user
        });
        return this.calendarRepository.save(event);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.calendarRepository.find({
            where: { user: { id: user.id } },
            order: { startDate: 'ASC' },
            take: 200
        });
    }

    async findOne(id: string) {
        return this.calendarRepository.findOneBy({ id });
    }

    async update(id: string, updateDto: UpdateCalendarEventDto) {
        const data: any = { ...updateDto };
        if (data.startDate && typeof data.startDate === 'string') {
            data.startDate = new Date(data.startDate);
        }
        if (data.endDate && typeof data.endDate === 'string') {
            data.endDate = new Date(data.endDate);
        }

        await this.calendarRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.calendarRepository.delete(id);
        return { deleted: true };
    }
}
