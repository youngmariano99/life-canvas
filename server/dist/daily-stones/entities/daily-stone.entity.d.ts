import type { User } from '../../database/entities/user.entity';
import type { Role } from '../../roles/entities/role.entity';
export declare class DailyStone {
    id: string;
    userId: string;
    date: Date;
    title: string;
    year: number;
    roleId: string | null;
    completed: boolean;
    note: string | null;
    user: User;
    role: Role;
}
