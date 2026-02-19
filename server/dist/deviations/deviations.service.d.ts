import { Repository } from 'typeorm';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
import { Deviation } from './entities/deviation.entity';
export declare class DeviationsService {
    private deviationRepository;
    constructor(deviationRepository: Repository<Deviation>);
    create(createDto: CreateDeviationDto, userId: string): Promise<Deviation>;
    findAll(userId: string, year?: number): Promise<Deviation[]>;
    findOne(id: string, userId: string): Promise<Deviation | null>;
    update(id: string, updateDto: UpdateDeviationDto, userId: string): Promise<Deviation | null>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
}
