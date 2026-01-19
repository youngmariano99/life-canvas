import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
import { FitnessActivity } from './entities/fitness-activity.entity';
import { FitnessRoutine } from './entities/fitness-routine.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class FitnessService {
    constructor(
        @InjectRepository(FitnessActivity)
        private activityRepository: Repository<FitnessActivity>,
        @InjectRepository(FitnessRoutine)
        private routineRepository: Repository<FitnessRoutine>,
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

    // --- Activities ---

    async create(createDto: CreateFitnessActivityDto) {
        const user = await this.getDemoUser();

        const activityDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;

        const activity = this.activityRepository.create({
            ...createDto,
            date: activityDate,
            user
        });
        return this.activityRepository.save(activity);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.activityRepository.find({
            where: { user: { id: user.id } },
            order: { date: 'DESC' },
            take: 100
        });
    }

    async findOne(id: string) {
        return this.activityRepository.findOneBy({ id });
    }

    async update(id: string, updateDto: UpdateFitnessActivityDto) {
        const data: any = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        await this.activityRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.activityRepository.delete(id);
        return { deleted: true };
    }

    // --- Routines ---

    async createRoutine(createDto: CreateFitnessRoutineDto) {
        const user = await this.getDemoUser();
        const routine = this.routineRepository.create({
            ...createDto,
            user,
        });
        return this.routineRepository.save(routine);
    }

    async findAllRoutines() {
        const user = await this.getDemoUser();
        return this.routineRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' }
        });
    }

    async deleteRoutine(id: string) {
        await this.routineRepository.delete(id);
        return { deleted: true };
    }
}
