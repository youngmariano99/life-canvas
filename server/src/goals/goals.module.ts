import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { Goal } from './entities/goal.entity';
import { SubGoal } from './entities/sub-goal.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Goal, SubGoal, User])],
    controllers: [GoalsController],
    providers: [GoalsService],
})
export class GoalsModule { }
