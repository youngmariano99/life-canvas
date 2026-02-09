import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDailyStoneDto } from './dto/create-daily-stone.dto';
import { DailyStone } from './entities/daily-stone.entity';

@Injectable()
export class DailyStonesService {
    constructor(
        @InjectRepository(DailyStone)
        private dailyStoneRepository: Repository<DailyStone>,
    ) { }

    async findAll(userId: string, year: number = 2026) {
        return this.dailyStoneRepository.find({
            where: { user: { id: userId }, year },
            order: { date: 'DESC' },
            take: 365,
            relations: ['role']
        });
    }

    async upsert(dto: CreateDailyStoneDto, userId: string) {
        // Extract YYYY-MM-DD to avoid time zone issues
        const dateStr = dto.date.split('T')[0];
        const year = new Date(dateStr).getFullYear();

        // Find by string date to ensure match
        let stone = await this.dailyStoneRepository.createQueryBuilder('stone')
            .where('stone.user_id = :userId', { userId: userId })
            .andWhere('stone.date = :date', { date: dateStr })
            .getOne();

        if (stone) {
            stone.title = dto.title;
            stone.roleId = dto.roleId || null;
            stone.completed = dto.completed ?? false;
            stone.note = dto.note || '';
            stone.year = year;
            // Don't update the date, keep the original
        } else {
            stone = this.dailyStoneRepository.create({
                user: { id: userId } as any,
                date: dateStr as any, // TypeORM handles string -> date cast for Postgres
                title: dto.title,
                roleId: dto.roleId || null,
                completed: dto.completed || false,
                note: dto.note || '',
                year: year
            });
        }
        return this.dailyStoneRepository.save(stone);
    }
}
