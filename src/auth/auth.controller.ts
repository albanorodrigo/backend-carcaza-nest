import { Controller, Get, Post, Body, HttpCode, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';

import { User } from './entities/user.entity';

import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

import { Auth, GetUser} from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { RawHeaders } from 'src/common/decorators/raw-header.decorator';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User was created', type: User})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Login OK', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  @ApiResponse({ status: 200, description: 'Login OK', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user); 
  }


  @Get('private')
  @UseGuards( AuthGuard() )
  @ApiResponse({ status: 200, description: 'Access OK'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ){

    return {
      ok: true,
      msg: 'Hola Mundo Private',
      user: user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  @ApiResponse({ status: 200, description: 'Access OK'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  privateRoute2(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  @ApiResponse({ status: 200, description: 'Access OK'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  privateRoute3(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }


}
