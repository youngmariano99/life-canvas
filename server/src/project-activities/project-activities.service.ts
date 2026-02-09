import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
import { ProjectActivity } from './entities/project-activity.entity';

@Injectable()
export class ProjectActivitiesService {
    constructor(
        @InjectRepository(ProjectActivity)
        private projectActivityRepository: Repository<ProjectActivity>,
    ) { }

    async create(createDto: CreateProjectActivityDto, userId: string) {
        const data: any = { ...createDto };
        if (typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }

        const activity = this.projectActivityRepository.create({
            ...data,
            project: { id: createDto.projectId } as any,
            role: createDto.roleId ? { id: createDto.roleId } as any : null
        });
        return this.projectActivityRepository.save(activity);
    }

    async findAll(userId: string) {
        // We need to fetch all activities for projects that belong to the user.
        // Project -> Goal -> User

        return this.projectActivityRepository.find({
            where: {
                project: {
                    goal: { user: { id: userId } }
                }
            },
            order: { sortOrder: 'ASC' }
        });
    }

    async findOne(id: string, userId: string) {
        return this.projectActivityRepository.findOne({
            where: {
                id,
                project: { goal: { user: { id: userId } } }
            }
        });
    }

    async update(id: string, updateDto: UpdateProjectActivityDto, userId: string) {
        const activity = await this.findOne(id, userId);
        if (!activity) throw new Error(`Activity ${id} not found`);

        const data: any = { ...updateDto };
        if (data.dueDate && typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectActivityRepository.update(id, data);
        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const activity = await this.findOne(id, userId);
        if (activity) {
            await this.projectActivityRepository.delete(id);
            return { deleted: true };
        }
        return { deleted: false };
    }
}
