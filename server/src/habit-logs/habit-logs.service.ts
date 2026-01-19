import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { HabitLog } from './entities/habit-log.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class HabitLogsService {
    constructor(
        @InjectRepository(HabitLog)
        private habitLogRepository: Repository<HabitLog>,
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

    async findAll() {
        // Return all logs for habits belonging to the user
        const user = await this.getDemoUser();
        return this.habitLogRepository.find({
            where: {
                habit: { user: { id: user.id } }
            },
            order: { date: 'DESC' }
        });
    }

    async upsert(createHabitLogDto: CreateHabitLogDto) {
        const { habitId, date, status, note } = createHabitLogDto;

        // Extract YYYY-MM-DD to avoid time zone issues
        const dateStr = typeof date === 'string' ? date.split('T')[0] : (date as Date).toISOString().split('T')[0];

        // Find by string date to ensure match
        let log = await this.habitLogRepository.createQueryBuilder('log')
            .where('log.habit_id = :habitId', { habitId })
            .andWhere('log.date = :date', { date: dateStr })
            .getOne();

        if (log) {
            // If exists, update status
            if (status) log.status = status;
            if (note !== undefined) log.note = note;
        } else {
            // If new, create
            log = this.habitLogRepository.create({
                habit: { id: habitId } as any,
                date: dateStr as any, // TypeORM will cast string to date for Postgres
                status: status || 'completed',
                note: note || ''
            });
        }
        return this.habitLogRepository.save(log);
    }
}
