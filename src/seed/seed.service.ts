import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {


  constructor(
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){

  }

  async runSeed() {

    await this.deleteTables();
    const users = await this.insertUsers();

    return `SEED EXECUTED`;
  }

  private async deleteTables() {

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();

  }

  private async insertUsers(){
    
    const seedUser = initialData.users;

    const users: User[] = [];

    seedUser.forEach(user => {
      users.push(this.userRepository.create(user))
    });

    const dbUser = await this.userRepository.save(seedUser);

    return dbUser[0];
  }
}
