import { Injectable } from '@angular/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from './database.service';
import { UserEntity } from '../entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserLocalService {
  private dataSource: DataSource;

  constructor(private databaseService: DatabaseService) {
    this.dataSource = this.databaseService.getDataSource();
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(user.password!, 10);
    var u: UserEntity = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      telephone: user.telephone,
      password: hashedPassword,
      entreprise: user.entreprise,
      pos: user.pos,
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: user.role,
      permission: user.permission,
      status: user.status,
      currency: user.currency,
      signature: user.signature
    }
    return this.dataSource.getRepository(UserEntity).save(u);
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: {
        id: id,
      },
      relations: {
        entreprise: true,
        pos: true
      },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.dataSource.getRepository(UserEntity).find({
      relations: {
        entreprise: true,
        pos: true
      },
    });
  }

  async updateUser(id: number, user: Partial<UserEntity>): Promise<void> {
    await this.dataSource.getRepository(UserEntity).update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.dataSource.getRepository(UserEntity).delete(id);
  }
}
