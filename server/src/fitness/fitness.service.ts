import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
import { FitnessActivity } from './entities/fitness-activity.entity';
import { FitnessRoutine } from './entities/fitness-routine.entity';
import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { CreateTrainingBlockDto, UpdateTrainingBlockDto } from './dto/training-block.dto';
import { Exercise } from './entities/exercise.entity';
import { TrainingBlock } from './entities/training-block.entity';

@Injectable()
export class FitnessService {
    constructor(
        @InjectRepository(FitnessActivity)
        private activityRepository: Repository<FitnessActivity>,
        @InjectRepository(FitnessRoutine)
        private routineRepository: Repository<FitnessRoutine>,
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
        @InjectRepository(TrainingBlock)
        private blockRepository: Repository<TrainingBlock>,
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

    // --- Exercises ---

    async findAllExercises(userId: string) {
        return this.exerciseRepository.find({
            where: { user: { id: userId } },
            order: { name: 'ASC' }
        });
    }

    async createExercise(createDto: CreateExerciseDto, userId: string) {
        const exercise = this.exerciseRepository.create({
            ...createDto,
            user: { id: userId } as any
        });
        return this.exerciseRepository.save(exercise);
    }

    async updateExercise(id: string, updateDto: UpdateExerciseDto, userId: string) {
        await this.exerciseRepository.update({ id, user: { id: userId } }, updateDto);
        return this.exerciseRepository.findOne({ where: { id, user: { id: userId } } });
    }

    async deleteExercise(id: string, userId: string) {
        const result = await this.exerciseRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }

    // --- Training Blocks ---

    async findAllBlocks(userId: string) {
        return this.blockRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }

    async createBlock(createDto: CreateTrainingBlockDto, userId: string) {
        // If isActive is true, deactivate others
        if (createDto.isActive) {
            await this.blockRepository.update({ user: { id: userId } }, { isActive: false });
        }

        const block = this.blockRepository.create({
            ...createDto,
            user: { id: userId } as any
        });
        return this.blockRepository.save(block);
    }

    async updateBlock(id: string, updateDto: UpdateTrainingBlockDto, userId: string) {
        if (updateDto.isActive) {
            await this.blockRepository.update({ user: { id: userId } }, { isActive: false });
        }
        await this.blockRepository.update({ id, user: { id: userId } }, updateDto);
        return this.blockRepository.findOne({ where: { id, user: { id: userId } } });
    }

    async deleteBlock(id: string, userId: string) {
        const result = await this.blockRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
