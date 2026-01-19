import type { Role } from '../../roles/entities/role.entity';
import type { Goal } from '../../goals/entities/goal.entity';
import type { Habit } from '../../habits/entities/habit.entity';
import type { Deviation } from '../../deviations/entities/deviation.entity';
import type { NoteFolder } from '../../notes/entities/note-folder.entity';
import type { Note } from '../../notes/entities/note.entity';
import type { NoteTag } from '../../notes/entities/note-tag.entity';
import type { DailyStone } from '../../daily-stones/entities/daily-stone.entity';
import type { FitnessActivity } from '../../fitness/entities/fitness-activity.entity';
import type { CalendarEvent } from '../../calendar/entities/calendar-event.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
    goals: Goal[];
    habits: Habit[];
    deviations: Deviation[];
    noteFolders: NoteFolder[];
    notes: Note[];
    noteTags: NoteTag[];
    dailyStones: DailyStone[];
    fitnessActivities: FitnessActivity[];
    calendarEvents: CalendarEvent[];
}
