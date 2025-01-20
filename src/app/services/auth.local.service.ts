import { Injectable } from '@angular/core';

import { DataSource } from 'typeorm'; 
import * as bcrypt from 'bcrypt';
import { DatabaseService } from './database.service';
import { AuthEntity } from '../entities/auth.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthLocalService {
  private dataSource: DataSource;

  constructor(private databaseService: DatabaseService) {
    this.dataSource = this.databaseService.getDataSource();
  }

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.dataSource.getRepository(UserEntity).findOne({
          where: {
            email: email,
          }, 
        });
    if (!user) {
      throw new Error('Invalid adresse email');
    }
    const validPassword = await bcrypt.compare(password, user.password!);
    if (!validPassword) {
      throw new Error('Invalid mot de passe');
    }
    const auth = this.dataSource.getRepository(AuthEntity).create({ userId: user.id, token: this.generateToken(user.id!) });
    localStorage.setItem('authToken', auth.token);
    return this.dataSource.getRepository(AuthEntity).save(auth);
  }

  private generateToken(userId: number): string {
    return `${userId}-${Math.random().toString(36).substring(2)}`;
  }

 
  async getUserById(userId: number): Promise<UserEntity> {
    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: {
        id: userId,
      },
      relations: {
        entreprise: true,
        pos: true
      },
    });
    if (!user) {
      throw new Error(`User with userId ${userId} not found`);
    }
    return user;
  }


  async getUserLoggedByToken(): Promise<UserEntity | undefined> {
    const token = localStorage.getItem('authToken');

    const auth = await this.dataSource.getRepository(AuthEntity).findOne({ 
      where: { 
        token : token!
      } 
    });
    if (auth) {
      const user = await this.getUserById(auth.userId);
      return user;
    }
    return undefined;
  }
}
