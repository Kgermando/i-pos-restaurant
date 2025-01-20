import { Injectable } from '@angular/core';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service';
import { PosEntity } from '../entities/pos.entity';

@Injectable({
  providedIn: 'root'
})
export class PosLocalService {
  private dataSource: DataSource;

  constructor(private databaseService: DatabaseService) {
    this.dataSource = this.databaseService.getDataSource();
  }

  async getAllData(): Promise<PosEntity[]> {
    return this.dataSource.getRepository(PosEntity).find({
      relations: {
        users: true,
        entreprise: true
      },
    });
  }


  async getOneData(id: number): Promise<PosEntity> {
    const user = await this.dataSource.getRepository(PosEntity).findOne({
      where: {
        id: id,
      },
      relations: {
        users: true,
        entreprise: true
      },
    });
    if (!user) {
      throw new Error(`pos with id ${id} not found`);
    }
    return user;
  }


  async createData(data: PosEntity): Promise<PosEntity> {
    return this.dataSource.getRepository(PosEntity).save(data);
  }

  async updateData(id: number, data: Partial<PosEntity>): Promise<void> {
    await this.dataSource.getRepository(PosEntity).update(id, data);
  }

  async deleteData(id: number): Promise<void> {
    await this.dataSource.getRepository(PosEntity).delete(id);
  }
}
