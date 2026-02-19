
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pomodoro } from './pomodoro.entity';

@Injectable()
export class PomodoroService {
    constructor(
        @InjectRepository(Pomodoro)
        private pomodoroRepository: Repository<Pomodoro>,
    ) { }

    async create(userId: string, createPomodoroDto: Partial<Pomodoro>): Promise<Pomodoro> {
        const pomodoro = this.pomodoroRepository.create({
            ...createPomodoroDto,
            userId,
        });
        return this.pomodoroRepository.save(pomodoro);
    }

    async findAll(userId: string): Promise<Pomodoro[]> {
        return this.pomodoroRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(userId: string, id: string): Promise<Pomodoro> {
        const pomodoro = await this.pomodoroRepository.findOne({ where: { id, userId } });
        if (!pomodoro) {
            throw new NotFoundException(`Pomodoro session with ID ${id} not found`);
        }
        return pomodoro;
    }

    async remove(userId: string, id: string): Promise<void> {
        const result = await this.pomodoroRepository.delete({ id, userId });
        if (result.affected === 0) {
            throw new NotFoundException(`Pomodoro session with ID ${id} not found`);
        }
    }
}
