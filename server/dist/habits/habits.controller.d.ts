import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
export declare class HabitsController {
    private readonly habitsService;
    constructor(habitsService: HabitsService);
    create(createHabitDto: CreateHabitDto, req: any): Promise<import("./entities/habit.entity").Habit>;
    findAll(req: any, year?: number): Promise<import("./entities/habit.entity").Habit[]>;
    findOne(id: string, req: any): Promise<import("./entities/habit.entity").Habit | null>;
    update(id: string, updateHabitDto: UpdateHabitDto, req: any): Promise<import("./entities/habit.entity").Habit | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
