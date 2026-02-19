
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PomodoroService } from './pomodoro.service';
import { PomodoroController } from './pomodoro.controller';
import { Pomodoro } from './pomodoro.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pomodoro])],
    controllers: [PomodoroController],
    providers: [PomodoroService],
    exports: [PomodoroService],
})
export class PomodoroModule { }
