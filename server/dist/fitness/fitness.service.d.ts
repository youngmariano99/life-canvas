import { Repository } from 'typeorm';
import { CreateFitnessActivityDto } from './dto/create-fitness-activity.dto';
import { CreateFitnessRoutineDto } from './dto/create-fitness-routine.dto';
import { UpdateFitnessActivityDto } from './dto/update-fitness-activity.dto';
import { FitnessActivity } from './entities/fitness-activity.entity';
import { FitnessRoutine } from './entities/fitness-routine.entity';
import { User } from '../database/entities/user.entity';
export declare class FitnessService {
    private activityRepository;
    private routineRepository;
    private userRepository;
    constructor(activityRepository: Repository<FitnessActivity>, routineRepository: Repository<FitnessRoutine>, userRepository: Repository<User>);
    private getDemoUser;
    create(createDto: CreateFitnessActivityDto): Promise<FitnessActivity>;
    findAll(): Promise<FitnessActivity[]>;
    findOne(id: string): Promise<FitnessActivity | null>;
    update(id: string, updateDto: UpdateFitnessActivityDto): Promise<FitnessActivity | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    createRoutine(createDto: CreateFitnessRoutineDto): Promise<FitnessRoutine>;
    findAllRoutines(): Promise<FitnessRoutine[]>;
    deleteRoutine(id: string): Promise<{
        deleted: boolean;
    }>;
}
