import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async create(createProjectDto: CreateProjectDto, userId: string) {
        // We link to a goal. Goals belong to verification.
        // Ideally we should check if goalId belongs to userId.
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

    async findAll(userId: string) {
        return this.projectRepository.find({
            where: {
                goal: {
                    user: { id: userId }
                }
            },
            order: { createdAt: 'DESC' },
            relations: ['activities']
        });
    }

    async findOne(id: string, userId: string) {
        return this.projectRepository.findOne({
            where: {
                id,
                goal: { user: { id: userId } }
            },
            relations: ['activities']
        });
    }

    async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
        const project = await this.findOne(id, userId);
        if (!project) throw new Error(`Project ${id} not found`);

        const data: any = { ...updateProjectDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectRepository.update(id, data);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        // To safely remove, we find it first or use delete with relations filter if TypeORM supports it for delete (it does mostly for direct props, for nested it's harder).
        // Safest is to find one then delete.
        const project = await this.findOne(id, userId);
        if (project) {
            await this.projectRepository.delete(id);
            return { deleted: true };
        }
        return { deleted: false };
    }
}
