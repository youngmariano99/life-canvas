import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
}
