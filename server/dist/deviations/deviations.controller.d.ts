import { DeviationsService } from './deviations.service';
import { CreateDeviationDto } from './dto/create-deviation.dto';
import { UpdateDeviationDto } from './dto/update-deviation.dto';
export declare class DeviationsController {
    private readonly deviationsService;
    constructor(deviationsService: DeviationsService);
    create(createDto: CreateDeviationDto, req: any): Promise<import("./entities/deviation.entity").Deviation>;
    findAll(req: any, year?: number): Promise<import("./entities/deviation.entity").Deviation[]>;
    findOne(id: string, req: any): Promise<import("./entities/deviation.entity").Deviation | null>;
    update(id: string, updateDto: UpdateDeviationDto, req: any): Promise<import("./entities/deviation.entity").Deviation | null>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
