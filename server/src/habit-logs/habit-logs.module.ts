import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitLogsService } from './habit-logs.service';
import { HabitLogsController } from './habit-logs.controller';
import { HabitLog } from './entities/habit-log.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([HabitLog, User])],
    controllers: [HabitLogsController],
    providers: [HabitLogsService],
})
export class HabitLogsModule { }
