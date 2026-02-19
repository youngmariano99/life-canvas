import { Repository } from 'typeorm';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';
export declare class HabitsService {
    private habitRepository;
    constructor(habitRepository: Repository<Habit>);
    create(createHabitDto: CreateHabitDto, userId: string): Promise<Habit>;
    findAll(userId: string, year?: number): Promise<Habit[]>;
    findOne(id: string, userId: string): Promise<Habit | null>;
    update(id: string, updateHabitDto: UpdateHabitDto, userId: string): Promise<Habit | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
