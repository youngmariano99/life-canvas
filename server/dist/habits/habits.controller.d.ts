import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
export declare class HabitsController {
    private readonly habitsService;
    constructor(habitsService: HabitsService);
    create(createHabitDto: CreateHabitDto): Promise<import("./entities/habit.entity").Habit>;
    findAll(): Promise<import("./entities/habit.entity").Habit[]>;
    findOne(id: string): Promise<import("./entities/habit.entity").Habit | null>;
    update(id: string, updateHabitDto: UpdateHabitDto): Promise<import("./entities/habit.entity").Habit | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
