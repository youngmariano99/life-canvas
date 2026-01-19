import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateResourceDto {
    @IsString()
    goalId: string;

    @IsString()
    name: string;

    @IsInt()
    quantityHave: number;

    @IsInt()
    quantityNeeded: number;

    @IsString()
    @IsOptional()
    unit?: string;
}
