import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { SubGoal } from './entities/sub-goal.entity';

@Injectable()
export class GoalsService {
    constructor(
        @InjectRepository(Goal)
        private goalRepository: Repository<Goal>,
        @InjectRepository(SubGoal)
        private subGoalRepository: Repository<SubGoal>,
    ) { }

    async create(createGoalDto: CreateGoalDto, userId: string) {
        const data: any = { ...createGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }

        const goal = this.goalRepository.create({
            ...data,
            user: { id: userId } as any,
            role: { id: createGoalDto.roleId } as any
        });
        return this.goalRepository.save(goal);
    }

    async findAll(userId: string, year: number = 2026) {
        return this.goalRepository.find({
            where: { user: { id: userId }, year },
            relations: ['projects', 'resources', 'subGoals'],
            order: { quarter: 'ASC', createdAt: 'DESC' }
        });
    }

    async findOne(id: string, userId: string) {
        return this.goalRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['role', 'projects', 'resources', 'subGoals']
        });
    }

    async update(id: string, updateGoalDto: UpdateGoalDto, userId: string) {
        const existingGoal = await this.findOne(id, userId);
        if (!existingGoal) {
            throw new NotFoundException(`Goal #${id} not found`);
        }

        const data: any = { ...updateGoalDto };
        if (typeof data.targetDate === 'string') {
            data.targetDate = new Date(data.targetDate);
        }

        // Manual orphan removal for subGoals
        if (data.subGoals && Array.isArray(data.subGoals)) {
            if (existingGoal.subGoals) {
                const incomingIds = data.subGoals.map((sg: any) => sg.id).filter((id: any) => id);
                const toRemove = existingGoal.subGoals.filter(sg => !incomingIds.includes(sg.id));

                if (toRemove.length > 0) {
                    await this.subGoalRepository.remove(toRemove);
                }
            }
        }

        // Use preload to handle deep partial updates (like subGoals)
        // Note: preload validates existence by ID internally but we already checked ownership.
        // However, preload doesn't take 'where' clause for ownership. 
        // We trust 'id' is correct and we checked ownership above.
        const goal = await this.goalRepository.preload({
            id: id,
            ...data,
        });

        if (!goal) {
            throw new NotFoundException(`Goal #${id} not found`);
        }

        // Ensure we don't accidentally ownership change (though preload shouldn't do that unless we pass user)
        // But to be safe, we can re-assign user? No need if we don't pass 'user' in data.

        return this.goalRepository.save(goal);
    }

    async remove(id: string, userId: string) {
        const result = await this.goalRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
