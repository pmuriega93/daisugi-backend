import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ParseUUIDPipe,
  Param,
  Delete,
  // SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetUser, Auth } from './decorators';

import { ChangePasswordDto, CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateClientDto } from 'src/clients/dto/update-client.dto';

@ApiTags('Auth Module - CRUD de usuarios')
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

  
  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  delete(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.authService.deleteUser(id);
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

}
