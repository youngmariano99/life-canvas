import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectActivityDto } from './dto/create-project-activity.dto';
import { UpdateProjectActivityDto } from './dto/update-project-activity.dto';
import { ProjectActivity } from './entities/project-activity.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ProjectActivitiesService {
    constructor(
        @InjectRepository(ProjectActivity)
        private projectActivityRepository: Repository<ProjectActivity>,
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

    async create(createDto: CreateProjectActivityDto) {
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

    async findAll() {
        // We need to fetch all activities for projects that belong to the user.
        // Project -> Goal -> User
        const user = await this.getDemoUser();

        return this.projectActivityRepository.find({
            where: {
                project: {
                    goal: { user: { id: user.id } }
                }
            },
            order: { sortOrder: 'ASC' }
        });
    }

    async findOne(id: string) {
        return this.projectActivityRepository.findOneBy({ id });
    }

    async update(id: string, updateDto: UpdateProjectActivityDto) {
        const data: any = { ...updateDto };
        if (data.dueDate && typeof data.dueDate === 'string') {
            data.dueDate = new Date(data.dueDate);
        }
        await this.projectActivityRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.projectActivityRepository.delete(id);
        return { deleted: true };
    }
}
