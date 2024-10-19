import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  Patch,
  ParseUUIDPipe,
  Param,
  // SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateClientDto } from 'src/clients/dto/update-client.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('create-user')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User
  ) {
    return this.authService.create(createUserDto, user);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.authService.updateUser(id, updateClientDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Patch('change-password')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }


  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken
    )
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
