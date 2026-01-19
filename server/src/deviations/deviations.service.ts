import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
import { Deviation } from './entities/deviation.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class DeviationsService {
    constructor(
        @InjectRepository(Deviation)
        private deviationRepository: Repository<Deviation>,
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

    async create(createDto: CreateDeviationDto) {
        const user = await this.getDemoUser();

        const deviationDate = typeof createDto.date === 'string'
            ? new Date(createDto.date)
            : createDto.date;

        const deviation = this.deviationRepository.create({
            ...createDto,
            date: deviationDate,
            user,
            goal: createDto.goalId ? { id: createDto.goalId } as any : null
        });
        return this.deviationRepository.save(deviation);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.deviationRepository.find({
            where: { user: { id: user.id } },
            order: { date: 'DESC' },
            relations: ['goal']
        });
    }

    async findOne(id: string) {
        return this.deviationRepository.findOne({
            where: { id },
            relations: ['goal']
        });
    }

    async update(id: string, updateDto: UpdateDeviationDto) {
        const data: any = { ...updateDto };
        if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
        }
        await this.deviationRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.deviationRepository.delete(id);
        return { deleted: true };
    }
}
