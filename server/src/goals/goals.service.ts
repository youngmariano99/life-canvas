import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class GoalsService {
    constructor(
        @InjectRepository(Goal)
        private goalRepository: Repository<Goal>,
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

    async create(createGoalDto: CreateGoalDto) {
        const user = await this.getDemoUser();
        // Handle date conversion if it comes as string
        const data: any = { ...createGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }

        const goal = this.goalRepository.create({
            ...data,
            user,
            role: { id: createGoalDto.roleId } as any
        });
        return this.goalRepository.save(goal);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.goalRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
            relations: ['role']
        });
    }

    async findOne(id: string) {
        return this.goalRepository.findOne({
            where: { id },
            relations: ['role']
        });
    }

    async update(id: string, updateGoalDto: UpdateGoalDto) {
        const data: any = { ...updateGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }
        await this.goalRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.goalRepository.delete(id);
        return { deleted: true };
    }
}
