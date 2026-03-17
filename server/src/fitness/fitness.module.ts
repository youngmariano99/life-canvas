import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessService } from './fitness.service';
import { FitnessController } from './fitness.controller';
import { FitnessActivity } from './entities/fitness-activity.entity';
import { FitnessRoutine } from './entities/fitness-routine.entity';
import { Exercise } from './entities/exercise.entity';
import { TrainingBlock } from './entities/training-block.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FitnessActivity, FitnessRoutine, Exercise, TrainingBlock, User])],
    controllers: [FitnessController],
    providers: [FitnessService],
})
export class FitnessModule { }
