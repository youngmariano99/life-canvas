import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
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

    async create(createProjectDto: CreateProjectDto) {
        // user check not strictly needed for creation as it links to goal, 
        // but good practice to ensure context if we enforce security later.

        const data: any = { ...createProjectDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }

        const project = this.projectRepository.create({
            ...data,
            goal: { id: createProjectDto.goalId } as any
        });
        return this.projectRepository.save(project);
    }

    async findAll() {
        const user = await this.getDemoUser();
        return this.projectRepository.find({
            where: {
                goal: {
                    user: { id: user.id }
                }
            },
            order: { createdAt: 'DESC' },
            relations: ['activities']
        });
    }

    async findOne(id: string) {
        return this.projectRepository.findOne({
            where: { id },
            relations: ['activities']
        });
    }

    async update(id: string, updateProjectDto: UpdateProjectDto) {
        const data: any = { ...updateProjectDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.projectRepository.delete(id);
        return { deleted: true };
    }
}
