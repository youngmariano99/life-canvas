import { Repository } from 'typeorm';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';
import { User } from '../database/entities/user.entity';
export declare class HabitsService {
    private habitRepository;
    private userRepository;
    constructor(habitRepository: Repository<Habit>, userRepository: Repository<User>);
    private getDemoUser;
    create(createHabitDto: CreateHabitDto): Promise<Habit>;
    findAll(): Promise<Habit[]>;
    findOne(id: string): Promise<Habit | null>;
    update(id: string, updateHabitDto: UpdateHabitDto): Promise<Habit | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
