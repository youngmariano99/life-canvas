import { Repository } from 'typeorm';
import { Goal } from '../goals/entities/goal.entity';
import { Habit } from '../habits/entities/habit.entity';
import { YearSettings } from './entities/year-settings.entity';
export declare class YearsService {
    private goalRepository;
    private habitRepository;
    private settingsRepository;
    constructor(goalRepository: Repository<Goal>, habitRepository: Repository<Habit>, settingsRepository: Repository<YearSettings>);
    getSettings(year: number, userId: string): Promise<YearSettings | null>;
    updateSettings(year: number, userId: string, settings: Partial<YearSettings>): Promise<YearSettings>;
    closeYear(year: number, userId: string): Promise<{
        success: boolean;
        message: string;
        migratedGoals: number;
        migratedHabits: number;
    }>;
}
