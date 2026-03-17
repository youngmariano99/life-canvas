import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';

export class CreateExerciseDto {
    @IsString()
    name: string;

    @IsString()
    @IsIn(['Fuerza', 'Cardio', 'Flexibilidad'])
    category: string;

    @IsOptional()
    @IsObject()
    records?: {
        maxWeight?: number;
        maxReps?: number;
        maxVolume?: number;
    };
}

export class UpdateExerciseDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @IsIn(['Fuerza', 'Cardio', 'Flexibilidad'])
    category?: string;

    @IsOptional()
    @IsObject()
    records?: {
        maxWeight?: number;
        maxReps?: number;
        maxVolume?: number;
    };
}
