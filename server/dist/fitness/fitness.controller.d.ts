import { FitnessService } from './fitness.service';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
export declare class FitnessController {
    private readonly fitnessService;
    constructor(fitnessService: FitnessService);
    createRoutine(createDto: CreateFitnessRoutineDto, req: any): Promise<import("./entities/fitness-routine.entity").FitnessRoutine>;
    findAllRoutines(req: any): Promise<import("./entities/fitness-routine.entity").FitnessRoutine[]>;
    deleteRoutine(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
    create(createDto: CreateFitnessActivityDto, req: any): Promise<import("./entities/fitness-activity.entity").FitnessActivity>;
    findAll(req: any): Promise<import("./entities/fitness-activity.entity").FitnessActivity[]>;
    findOne(id: string, req: any): Promise<import("./entities/fitness-activity.entity").FitnessActivity | null>;
    update(id: string, updateDto: UpdateFitnessActivityDto, req: any): Promise<import("./entities/fitness-activity.entity").FitnessActivity | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
