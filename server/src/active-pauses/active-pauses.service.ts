import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivePauseRoutineEntity } from './entities/active-pause-routine.entity';
import { ActivePauseEntryEntity } from './entities/active-pause-entry.entity';
import { CreateActivePauseRoutineDto, UpdateActivePauseRoutineDto, CreateActivePauseEntryDto } from './dto/active-pause.dto';

@Injectable()
export class ActivePauseService {
    constructor(
        @InjectRepository(ActivePauseRoutineEntity)
        private routineRepo: Repository<ActivePauseRoutineEntity>,
        @InjectRepository(ActivePauseEntryEntity)
        private entryRepo: Repository<ActivePauseEntryEntity>,
    ) { }

    // Routines
    async createRoutine(userId: string, createDto: CreateActivePauseRoutineDto) {
        const routine = this.routineRepo.create({ ...createDto, userId });
        return this.routineRepo.save(routine);
    }

    async findAllRoutines(userId: string) {
        return this.routineRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }

    async updateRoutine(userId: string, id: string, updateDto: UpdateActivePauseRoutineDto) {
        await this.routineRepo.update({ id, userId }, updateDto);
        return this.routineRepo.findOne({ where: { id, userId } });
    }

    async removeRoutine(userId: string, id: string) {
        await this.routineRepo.delete({ id, userId });
        return { deleted: true };
    }

    // Entries (History)
    async createEntry(userId: string, createDto: CreateActivePauseEntryDto) {
        // We need to resolve the relationship if routineId is provided, but since we are just saving ID mostly
        // NestJS TypeORM save handles DTOs with IDs if mapped correctly, but let's be explicit
        const entry = this.entryRepo.create({
            ...createDto,
            userId,
            routine: { id: createDto.routineId } as any // associate by ID
        });
        return this.entryRepo.save(entry);
    }

    async findAllEntries(userId: string) {
        return this.entryRepo.find({
            where: { userId },
            order: { date: 'DESC' },
            relations: ['routine']
        });
    }
}
