import { Repository } from 'typeorm';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
import { Deviation } from './entities/deviation.entity';
import { User } from '../database/entities/user.entity';
export declare class DeviationsService {
    private deviationRepository;
    private userRepository;
    constructor(deviationRepository: Repository<Deviation>, userRepository: Repository<User>);
    private getDemoUser;
    create(createDto: CreateDeviationDto): Promise<Deviation>;
    findAll(): Promise<Deviation[]>;
    findOne(id: string): Promise<Deviation | null>;
    update(id: string, updateDto: UpdateDeviationDto): Promise<Deviation | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
