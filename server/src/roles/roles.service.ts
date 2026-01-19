import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // Helper to ensure we have a user
  private async getDemoUser() {
    let user = await this.userRepository.findOne({ where: { email: 'demo@lifecanvas.com' } });
    if (!user) {
      user = this.userRepository.create({
        email: 'demo@lifecanvas.com',
        name: 'Demo User',
      });
      await this.userRepository.save(user);
    }
    return user;
  }

  async create(createRoleDto: CreateRoleDto) {
    const user = await this.getDemoUser();
    const role = this.roleRepository.create({
      ...createRoleDto,
      user,
    });
    return this.roleRepository.save(role);
  }

  async findAll() {
    const user = await this.getDemoUser();
    return this.roleRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.roleRepository.findOneBy({ id });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.roleRepository.delete(id);
    return { deleted: true };
  }
}
