import { Repository } from 'typeorm';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
import { FitnessActivity } from './entities/fitness-activity.entity';
import { FitnessRoutine } from './entities/fitness-routine.entity';
export declare class FitnessService {
    private activityRepository;
    private routineRepository;
    constructor(activityRepository: Repository<FitnessActivity>, routineRepository: Repository<FitnessRoutine>);
    create(createDto: CreateFitnessActivityDto, userId: string): Promise<FitnessActivity>;
    findAll(userId: string): Promise<FitnessActivity[]>;
    findOne(id: string, userId: string): Promise<FitnessActivity | null>;
    update(id: string, updateDto: UpdateFitnessActivityDto, userId: string): Promise<FitnessActivity | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    createRoutine(createDto: CreateFitnessRoutineDto, userId: string): Promise<FitnessRoutine>;
    findAllRoutines(userId: string): Promise<FitnessRoutine[]>;
    deleteRoutine(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
