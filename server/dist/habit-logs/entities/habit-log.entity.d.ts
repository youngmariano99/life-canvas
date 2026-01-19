import type { Habit } from '../../habits/entities/habit.entity';
export declare class HabitLog {
    id: string;
    habitId: string;
    date: Date;
    status: string;
    note: string;
    habit: Habit;
}
