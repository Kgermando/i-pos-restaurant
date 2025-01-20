import { Injectable } from '@angular/core';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service'; 
import { EntrepriseEntity } from '../entities/entreprise.entity';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseLocalService {
  private dataSource: DataSource;

  constructor(private databaseService: DatabaseService) {
    this.dataSource = this.databaseService.getDataSource();
  }

  async getAllData(): Promise<EntrepriseEntity[]> {
    return this.dataSource.getRepository(EntrepriseEntity).find({
      relations: {
        users: true,
        pos: true
      },
    });
  }

  async getOneData(id: number): Promise<EntrepriseEntity> {
    const user = await this.dataSource.getRepository(EntrepriseEntity).findOne({
      where: {
        id: id,
      },
      relations: {
        users: true,
        pos: true
      },
    });
    if (!user) {
      throw new Error(`Entreprise with id ${id} not found`);
    }
    return user;
  } 

  async createData(data: EntrepriseEntity): Promise<EntrepriseEntity> {
    return this.dataSource.getRepository(EntrepriseEntity).save(data);
  }

  async updateData(id: number, data: Partial<EntrepriseEntity>): Promise<void> {
    await this.dataSource.getRepository(EntrepriseEntity).update(id, data);
  }

  async deleteData(id: number): Promise<void> {
    await this.dataSource.getRepository(EntrepriseEntity).delete(id);
  }
}
