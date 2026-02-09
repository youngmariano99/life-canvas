import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';

@Injectable()
export class HabitsService {
    constructor(
        @InjectRepository(Habit)
        private habitRepository: Repository<Habit>,
    ) { }

    async create(createHabitDto: CreateHabitDto, userId: string) {
        const habit = this.habitRepository.create({
            ...createHabitDto,
            user: { id: userId } as any,
            role: createHabitDto.roleId ? { id: createHabitDto.roleId } as any : null
        });
        return this.habitRepository.save(habit);
    }

    async findAll(userId: string) {
        return this.habitRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            relations: ['role', 'logs']
        });
    }

    async findOne(id: string, userId: string) {
        return this.habitRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['logs'] // deviations later
        });
    }

    async update(id: string, updateHabitDto: UpdateHabitDto, userId: string) {
        const habit = await this.findOne(id, userId);
        if (!habit) {
            throw new Error(`Habit ${id} not found`);
        }
        await this.habitRepository.update(id, updateHabitDto);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const result = await this.habitRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
