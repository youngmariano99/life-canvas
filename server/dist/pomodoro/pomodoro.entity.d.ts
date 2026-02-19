import { User } from '../database/entities/user.entity';
export declare enum PomodoroMode {
    TIMER = "timer",
    STOPWATCH = "stopwatch"
}
export declare class Pomodoro {
    id: string;
    type: PomodoroMode;
    startTime: Date;
    endTime: Date;
    duration: number;
    plannedDuration: number;
    activityName: string;
    notes: string;
    roleId: string;
    projectId: string;
    habitId: string;
    goalId: string;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
