import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { User } from '../database/entities/user.entity';
import { SubGoal } from './entities/sub-goal.entity';

@Injectable()
export class GoalsService {
    constructor(
        @InjectRepository(Goal)
        private goalRepository: Repository<Goal>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(SubGoal)
        private subGoalRepository: Repository<SubGoal>,
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
            where: { userId: user.id },
            relations: ['projects', 'resources', 'subGoals'],
            order: { quarter: 'ASC', createdAt: 'DESC' }
        });
    }

    async findOne(id: string) {
        return this.goalRepository.findOne({
            where: { id },
            relations: ['role', 'projects', 'resources', 'subGoals']
        });
    }

    async update(id: string, updateGoalDto: UpdateGoalDto) {
        const data: any = { ...updateGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }

        // Manual orphan removal for subGoals
        if (data.subGoals && Array.isArray(data.subGoals)) {
            const existingGoal = await this.goalRepository.findOne({
                where: { id },
                relations: ['subGoals']
            });

            if (existingGoal && existingGoal.subGoals) {
                const incomingIds = data.subGoals.map((sg: any) => sg.id).filter((id: any) => id);
                const toRemove = existingGoal.subGoals.filter(sg => !incomingIds.includes(sg.id));

                if (toRemove.length > 0) {
                    await this.subGoalRepository.remove(toRemove);
                }
            }
        }

        // Use preload to handle deep partial updates (like subGoals)
        const goal = await this.goalRepository.preload({
            id: id,
            ...data,
        });

        if (!goal) {
            throw new NotFoundException(`Goal #${id} not found`);
        }

        return this.goalRepository.save(goal);
    }

    async remove(id: string) {
        await this.goalRepository.delete(id);
        return { deleted: true };
    }
}
