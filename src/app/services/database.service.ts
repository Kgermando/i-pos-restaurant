import { Injectable } from '@angular/core';
import { DataSource } from 'typeorm'; 
import { UserEntity } from '../entities/user.entity';
import { EntrepriseEntity } from '../entities/entreprise.entity';
import { PosEntity } from '../entities/pos.entity';
import { AuthEntity } from '../entities/auth.entity';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dataSource!: DataSource;

  constructor() {
    this.initializeDataSource();
  }

  private async initializeDataSource() {
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [ 
        UserEntity,
        EntrepriseEntity,
        PosEntity,
        AuthEntity,
      ],
      synchronize: true,
      logging: false
    });

    try {
      await this.dataSource.initialize();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Error during Data Source initialization:', error);
    }
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }
}
