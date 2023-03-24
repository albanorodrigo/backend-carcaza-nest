import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [
    SeedController
  ],
  providers: [
    SeedService
  ],
  imports: [
    CommonModule,
    AuthModule
  ]
})
export class SeedModule {}
