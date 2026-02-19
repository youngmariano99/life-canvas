import { User } from '../../database/entities/user.entity';
export declare class YearSettings {
    id: string;
    year: number;
    vision5Years: string;
    visionImages: string[];
    mission: string;
    h1Priority: string;
    h2Priority: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
