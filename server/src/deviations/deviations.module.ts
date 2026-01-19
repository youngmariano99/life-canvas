import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviationsService } from './deviations.service';
import { DeviationsController } from './deviations.controller';
import { Deviation } from './entities/deviation.entity';
import { User } from '../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Deviation, User])],
    controllers: [DeviationsController],
    providers: [DeviationsService],
})
export class DeviationsModule { }
