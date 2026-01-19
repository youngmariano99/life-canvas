import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
import { DailyStone } from './entities/daily-stone.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class DailyStonesService {
    constructor(
        @InjectRepository(DailyStone)
        private dailyStoneRepository: Repository<DailyStone>,
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
        const user = await this.getDemoUser();
        return this.dailyStoneRepository.find({
            where: { user: { id: user.id } },
            order: { date: 'DESC' },
            take: 365,
            relations: ['role']
        });
    }

    async upsert(dto: CreateDailyStoneDto) {
        const user = await this.getDemoUser();
        // Extract YYYY-MM-DD to avoid time zone issues
        const dateStr = dto.date.split('T')[0];

        // Find by string date to ensure match
        let stone = await this.dailyStoneRepository.createQueryBuilder('stone')
            .where('stone.user_id = :userId', { userId: user.id })
            .andWhere('stone.date = :date', { date: dateStr })
            .getOne();

        if (stone) {
            stone.title = dto.title;
            stone.roleId = dto.roleId || null;
            stone.completed = dto.completed ?? false;
            stone.note = dto.note || '';
            // Don't update the date, keep the original
        } else {
            stone = this.dailyStoneRepository.create({
                user,
                date: dateStr as any, // TypeORM handles string -> date cast for Postgres
                title: dto.title,
                roleId: dto.roleId || null,
                completed: dto.completed || false,
                note: dto.note || ''
            });
        }
        return this.dailyStoneRepository.save(stone);
    }
}
