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
  ) { }

  async create(createRoleDto: CreateRoleDto, userId: string) {
    const role = this.roleRepository.create({
      ...createRoleDto,
      user: { id: userId } as any, // Simple relation binding
    });
    return this.roleRepository.save(role);
  }

  async findAll(userId: string) {
    return this.roleRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.roleRepository.findOne({ where: { id, user: { id: userId } } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, userId: string) {
    const role = await this.findOne(id, userId);
    if (!role) {
      throw new Error(`Role ${id} not found`);
    }
    const updated = this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(updated);
  }

  async remove(id: string, userId: string) {
    const result = await this.roleRepository.delete({ id, user: { id: userId } });
    return { deleted: (result.affected ?? 0) > 0 };
  }
}
