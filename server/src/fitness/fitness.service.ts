import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
import { FitnessActivity } from './entities/fitness-activity.entity';
import { FitnessRoutine } from './entities/fitness-routine.entity';

@Injectable()
export class FitnessService {
    constructor(
        @InjectRepository(FitnessActivity)
        private activityRepository: Repository<FitnessActivity>,
        @InjectRepository(FitnessRoutine)
        private routineRepository: Repository<FitnessRoutine>,
    ) { }

    // --- Activities ---

    async create(createDto: CreateFitnessActivityDto, userId: string) {
        const activityDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;

        const activity = this.activityRepository.create({
            ...createDto,
            date: activityDate,
            user: { id: userId } as any
        });
        return this.activityRepository.save(activity);
    }

    async findAll(userId: string) {
        return this.activityRepository.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
            take: 100
        });
    }

    async findOne(id: string, userId: string) {
        return this.activityRepository.findOne({ where: { id, user: { id: userId } } });
    }

    async update(id: string, updateDto: UpdateFitnessActivityDto, userId: string) {
        const activity = await this.findOne(id, userId);
        if (!activity) throw new Error(`Activity ${id} not found`);

        const data: any = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        await this.activityRepository.update(id, data);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const result = await this.activityRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }

    // --- Routines ---

    async createRoutine(createDto: CreateFitnessRoutineDto, userId: string) {
        const routine = this.routineRepository.create({
            ...createDto,
            user: { id: userId } as any,
        });
        return this.routineRepository.save(routine);
    }

    async findAllRoutines(userId: string) {
        return this.routineRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }

    async deleteRoutine(id: string, userId: string) {
        const result = await this.routineRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
