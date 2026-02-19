import { PomodoroService } from './pomodoro.service';
import { Pomodoro } from './pomodoro.entity';
export declare class PomodoroController {
    private readonly pomodoroService;
    constructor(pomodoroService: PomodoroService);
    create(req: any, createPomodoroDto: Partial<Pomodoro>): Promise<Pomodoro>;
    findAll(req: any): Promise<Pomodoro[]>;
    findOne(req: any, id: string): Promise<Pomodoro>;
    remove(req: any, id: string): Promise<void>;
}
