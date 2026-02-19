import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivePauseService } from './active-pauses.service';
import { ActivePauseController } from './active-pauses.controller';
import { ActivePauseRoutineEntity } from './entities/active-pause-routine.entity';
import { ActivePauseEntryEntity } from './entities/active-pause-entry.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivePauseRoutineEntity, ActivePauseEntryEntity])],
    controllers: [ActivePauseController],
    providers: [ActivePauseService],
    exports: [ActivePauseService]
})
export class ActivePauseModule { }
