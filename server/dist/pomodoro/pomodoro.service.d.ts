import { Repository } from 'typeorm';
import { Pomodoro } from './pomodoro.entity';
export declare class PomodoroService {
    private pomodoroRepository;
    constructor(pomodoroRepository: Repository<Pomodoro>);
    create(userId: string, createPomodoroDto: Partial<Pomodoro>): Promise<Pomodoro>;
    findAll(userId: string): Promise<Pomodoro[]>;
    findOne(userId: string, id: string): Promise<Pomodoro>;
    remove(userId: string, id: string): Promise<void>;
}
