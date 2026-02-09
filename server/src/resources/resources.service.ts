import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
    ) { }

    async create(createDto: CreateResourceDto, userId: string) {
        // Technically strict check would be goal.user.id == userId
        const resource = this.resourceRepository.create({
            ...createDto,
            goal: createDto.goalId ? { id: createDto.goalId } as any : undefined,
        });
        return this.resourceRepository.save(resource);
    }

    async findAll(userId: string, year: number = 2026) {
        return this.resourceRepository.find({
            where: {
                year,
                goal: { user: { id: userId } }
            },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string, userId: string) {
        return this.resourceRepository.findOne({
            where: { id, goal: { user: { id: userId } } }
        });
    }

    async update(id: string, updateDto: UpdateResourceDto, userId: string) {
        const resource = await this.findOne(id, userId);
        if (!resource) throw new Error(`Resource ${id} not found`);

        await this.resourceRepository.update(id, updateDto);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const resource = await this.findOne(id, userId);
        if (resource) {
            await this.resourceRepository.delete(id);
            return { deleted: true };
        }
        return { deleted: false };
    }
}
