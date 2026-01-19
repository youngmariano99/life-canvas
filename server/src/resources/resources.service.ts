import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
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

    async create(createDto: CreateResourceDto) {
        const resource = this.resourceRepository.create({
            ...createDto,
            goal: createDto.goalId ? { id: createDto.goalId } as any : undefined,
        });
        return this.resourceRepository.save(resource);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.resourceRepository.find({
            where: {
                goal: { user: { id: user.id } }
            },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string) {
        return this.resourceRepository.findOneBy({ id });
    }

    async update(id: string, updateDto: UpdateResourceDto) {
        await this.resourceRepository.update(id, updateDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.resourceRepository.delete(id);
        return { deleted: true };
    }
}
