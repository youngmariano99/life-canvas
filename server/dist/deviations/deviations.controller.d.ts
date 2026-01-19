import { DeviationsService } from './deviations.service';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
export declare class DeviationsController {
    private readonly deviationsService;
    constructor(deviationsService: DeviationsService);
    create(createDto: CreateDeviationDto): Promise<import("./entities/deviation.entity").Deviation>;
    findAll(): Promise<import("./entities/deviation.entity").Deviation[]>;
    findOne(id: string): Promise<import("./entities/deviation.entity").Deviation | null>;
    update(id: string, updateDto: UpdateDeviationDto): Promise<import("./entities/deviation.entity").Deviation | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
