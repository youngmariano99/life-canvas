import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
import { Deviation } from './entities/deviation.entity';

@Injectable()
export class DeviationsService {
    constructor(
        @InjectRepository(Deviation)
        private deviationRepository: Repository<Deviation>,
    ) { }

    async create(createDto: CreateDeviationDto, userId: string) {
        const deviationDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;

        const deviation = this.deviationRepository.create({
            ...createDto,
            date: deviationDate,
            user: { id: userId } as any,
            goal: createDto.goalId ? { id: createDto.goalId } as any : null
        });
        return this.deviationRepository.save(deviation);
    }

    async findAll(userId: string) {
        return this.deviationRepository.find({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
            relations: ['goal']
        });
    }

    async findOne(id: string, userId: string) {
        return this.deviationRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['goal']
        });
    }

    async update(id: string, updateDto: UpdateDeviationDto, userId: string) {
        const deviation = await this.findOne(id, userId);
        if (!deviation) throw new Error(`Deviation ${id} not found`);

        const data: any = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        await this.deviationRepository.update(id, data);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const result = await this.deviationRepository.delete({ id, user: { id: userId } });
        return { deleted: (result.affected ?? 0) > 0 };
    }
}
