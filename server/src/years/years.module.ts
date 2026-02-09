import { Module } from '@nestjs/common';
import { YearsService } from './years.service';
import { YearsController } from './years.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../goals/entities/goal.entity';
import { Habit } from '../habits/entities/habit.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Goal, Habit])],
    controllers: [YearsController],
    providers: [YearsService],
})
export class YearsModule { }
