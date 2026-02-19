import { Repository } from 'typeorm';
import { ActivePauseRoutineEntity } from './entities/active-pause-routine.entity';
import { ActivePauseEntryEntity } from './entities/active-pause-entry.entity';
import { CreateActivePauseRoutineDto, UpdateActivePauseRoutineDto, CreateActivePauseEntryDto } from './dto/active-pause.dto';
export declare class ActivePauseService {
    private routineRepo;
    private entryRepo;
    constructor(routineRepo: Repository<ActivePauseRoutineEntity>, entryRepo: Repository<ActivePauseEntryEntity>);
    createRoutine(userId: string, createDto: CreateActivePauseRoutineDto): Promise<ActivePauseRoutineEntity>;
    findAllRoutines(userId: string): Promise<ActivePauseRoutineEntity[]>;
    updateRoutine(userId: string, id: string, updateDto: UpdateActivePauseRoutineDto): Promise<ActivePauseRoutineEntity | null>;
    removeRoutine(userId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    createEntry(userId: string, createDto: CreateActivePauseEntryDto): Promise<ActivePauseEntryEntity>;
    findAllEntries(userId: string): Promise<ActivePauseEntryEntity[]>;
}
