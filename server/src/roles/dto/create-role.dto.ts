import { IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
