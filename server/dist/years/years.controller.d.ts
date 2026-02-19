import { YearsService } from './years.service';
export declare class YearsController {
    private readonly yearsService;
    constructor(yearsService: YearsService);
    getSettings(year: string, req: any): Promise<import("./entities/year-settings.entity").YearSettings | null>;
    updateSettings(body: {
        year: number;
        settings: any;
    }, req: any): Promise<import("./entities/year-settings.entity").YearSettings>;
    closeYear(body: {
        year: number;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        migratedGoals: number;
        migratedHabits: number;
    }>;
}
