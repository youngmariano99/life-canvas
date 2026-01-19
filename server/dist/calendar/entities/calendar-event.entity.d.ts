import type { User } from '../../database/entities/user.entity';
export declare class CalendarEvent {
    id: string;
    userId: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    tag: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
