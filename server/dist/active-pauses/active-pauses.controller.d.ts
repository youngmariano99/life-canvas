import { ActivePauseService } from './active-pauses.service';
import { CreateActivePauseRoutineDto, UpdateActivePauseRoutineDto, CreateActivePauseEntryDto } from './dto/active-pause.dto';
export declare class ActivePauseController {
    private readonly activePauseService;
    constructor(activePauseService: ActivePauseService);
    createRoutine(req: any, createDto: CreateActivePauseRoutineDto): Promise<import("./entities/active-pause-routine.entity").ActivePauseRoutineEntity>;
    findAllRoutines(req: any): Promise<import("./entities/active-pause-routine.entity").ActivePauseRoutineEntity[]>;
    updateRoutine(req: any, id: string, updateDto: UpdateActivePauseRoutineDto): Promise<import("./entities/active-pause-routine.entity").ActivePauseRoutineEntity | null>;
    removeRoutine(req: any, id: string): Promise<{
        deleted: boolean;
    }>;
    createEntry(req: any, createDto: CreateActivePauseEntryDto): Promise<import("./entities/active-pause-entry.entity").ActivePauseEntryEntity>;
    findAllEntries(req: any): Promise<import("./entities/active-pause-entry.entity").ActivePauseEntryEntity[]>;
}
