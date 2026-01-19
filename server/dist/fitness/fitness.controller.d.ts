import { FitnessService } from './fitness.service';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
export declare class FitnessController {
    private readonly fitnessService;
    constructor(fitnessService: FitnessService);
    createRoutine(createDto: CreateFitnessRoutineDto): Promise<import("./entities/fitness-routine.entity").FitnessRoutine>;
    findAllRoutines(): Promise<import("./entities/fitness-routine.entity").FitnessRoutine[]>;
    deleteRoutine(id: string): Promise<{
        deleted: boolean;
    }>;
    create(createDto: CreateFitnessActivityDto): Promise<import("./entities/fitness-activity.entity").FitnessActivity>;
    findAll(): Promise<import("./entities/fitness-activity.entity").FitnessActivity[]>;
    findOne(id: string): Promise<import("./entities/fitness-activity.entity").FitnessActivity | null>;
    update(id: string, updateDto: UpdateFitnessActivityDto): Promise<import("./entities/fitness-activity.entity").FitnessActivity | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
