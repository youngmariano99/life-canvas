import type { User } from '../../database/entities/user.entity';
import type { Role } from '../../roles/entities/role.entity';
import type { HabitLog } from '../../habit-logs/entities/habit-log.entity';
export declare class Habit {
    id: string;
    userId: string;
    roleId: string;
    name: string;
    frequency: string;
    customDays: number[];
    createdAt: Date;
    user: User;
    role: Role;
    logs: HabitLog[];
}
