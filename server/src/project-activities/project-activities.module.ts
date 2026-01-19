import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectActivitiesService } from './project-activities.service';
import { ProjectActivitiesController } from './project-activities.controller';
import { ProjectActivity } from './entities/project-activity.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectActivity, User])],
    controllers: [ProjectActivitiesController],
    providers: [ProjectActivitiesService],
})
export class ProjectActivitiesModule { }
