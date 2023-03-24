import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('User');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){

  }


  async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJWToken({ id: user.id })
      };
      
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where : {email},
      select: { id: true, email: true, password: true}
    });

    if(!user)
      throw new UnauthorizedException(`Credentials are not valid`);

    if(!bcrypt.compareSync( password, user.password ))
      throw new UnauthorizedException(`Credentials are not valid`);

    
    return {
      ...user,
      token: this.getJWToken({ id: user.id })
    };

  }

  async checkAuthStatus(user: User){
    
    return {
      ...user,
      token: this.getJWToken({ id: user.id })
    };
  }

  private getJWToken( payload: JwtPayload ){

    return this.jwtService.sign( payload );
  }

  private handleDBExceptions(error: any){

    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error - Check error log`);
  }
}
