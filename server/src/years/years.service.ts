import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from '../goals/entities/goal.entity';
import { Habit } from '../habits/entities/habit.entity';
import { YearSettings } from './entities/year-settings.entity';

@Injectable()
export class YearsService {
    constructor(
        @InjectRepository(Goal)
        private goalRepository: Repository<Goal>,
        @InjectRepository(Habit)
        private habitRepository: Repository<Habit>,
        @InjectRepository(YearSettings)
        private settingsRepository: Repository<YearSettings>,
    ) { }

    async getSettings(year: number, userId: string) {
        return this.settingsRepository.findOne({
            where: { year, user: { id: userId } }
        });
    }

    async updateSettings(year: number, userId: string, settings: Partial<YearSettings>) {
        const existing = await this.getSettings(year, userId);
        if (existing) {
            return this.settingsRepository.save({
                ...existing,
                ...settings
            });
        }

        const newSettings = this.settingsRepository.create({
            ...settings,
            year,
            user: { id: userId } as any
        });
        return this.settingsRepository.save(newSettings);
    }

    async closeYear(year: number, userId: string) {
        const nextYear = year + 1;

        // 1. Duplicate Goals that are not completed
        const goalsToMigrate = await this.goalRepository.find({
            where: {
                user: { id: userId },
                year: year,
                // status: 'pending' // Maybe all goals? Or just pending/in-progress?
                // Let's migrate all for now, or maybe filtered?
                // Usually, we want to migrate PENDING goals.
                // Completed goals stay in the past.
            },
            relations: ['subGoals']
        });

        const pendingGoals = goalsToMigrate.filter(g => g.status !== 'completed');

        for (const goal of pendingGoals) {
            // Check if already exists in next year to prevent duplicates if run multiple times
            const exists = await this.goalRepository.findOne({
                where: {
                    user: { id: userId },
                    year: nextYear,
                    title: goal.title
                }
            });

            if (!exists) {
                const newGoal = this.goalRepository.create({
                    ...goal,
                    id: undefined, // Create new ID
                    year: nextYear,
                    createdAt: undefined,
                    updatedAt: undefined,
                    user: { id: userId } as any,
                    role: { id: goal.roleId } as any,
                    // Deep copy subgoals if needed, but for simplicity let's handle main entity first
                    // SubGoals are tied to parent.
                    subGoals: goal.subGoals?.map(sg => ({
                        ...sg,
                        id: undefined,
                        createdAt: undefined,
                        updatedAt: undefined
                    }))
                });
                await this.goalRepository.save(newGoal);
            }
        }

        // 2. Duplicate Habits
        // Habits are usually perennial. So we should copy ALL active habits.
        const habits = await this.habitRepository.find({
            where: { user: { id: userId }, year: year }
        });

        for (const habit of habits) {
            const exists = await this.habitRepository.findOne({
                where: {
                    user: { id: userId },
                    year: nextYear,
                    name: habit.name
                }
            });

            if (!exists) {
                const newHabit = this.habitRepository.create({
                    ...habit,
                    id: undefined,
                    year: nextYear,
                    createdAt: undefined,
                    user: { id: userId } as any,
                    role: habit.roleId ? { id: habit.roleId } as any : null,
                    logs: [] // Start fresh
                });
                await this.habitRepository.save(newHabit);
            }
        }

        // 3. Migrate Settings? Maybe optional. For now, let's start fresh or user can manually copy.

        return {
            success: true,
            message: `Successfully closed ${year} and prepared ${nextYear}`,
            migratedGoals: pendingGoals.length,
            migratedHabits: habits.length
        };
    }
}
