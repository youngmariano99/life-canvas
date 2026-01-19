import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class HabitsService {
    constructor(
        @InjectRepository(Habit)
        private habitRepository: Repository<Habit>,
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

    async create(createHabitDto: CreateHabitDto) {
        const user = await this.getDemoUser();
        const habit = this.habitRepository.create({
            ...createHabitDto,
            user,
            role: createHabitDto.roleId ? { id: createHabitDto.roleId } as any : null
        });
        return this.habitRepository.save(habit);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.habitRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
            relations: ['role', 'logs']
        });
    }

    async findOne(id: string) {
        return this.habitRepository.findOne({
            where: { id },
            relations: ['logs'] // deviations later
        });
    }

    async update(id: string, updateHabitDto: UpdateHabitDto) {
        await this.habitRepository.update(id, updateHabitDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.habitRepository.delete(id);
        return { deleted: true };
    }
}
