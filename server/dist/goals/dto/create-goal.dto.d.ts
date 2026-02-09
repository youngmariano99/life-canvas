export declare class CreateGoalDto {
    roleId: string;
    title: string;
    description?: string;
    quarter?: number;
    semester?: number;
    status?: string;
    targetDate?: Date;
    subGoals?: any[];
}
