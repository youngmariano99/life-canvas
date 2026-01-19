import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyStonesService } from './daily-stones.service';
import { DailyStonesController } from './daily-stones.controller';
import { DailyStone } from './entities/daily-stone.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DailyStone, User])],
    controllers: [DailyStonesController],
    providers: [DailyStonesService],
})
export class DailyStonesModule { }
