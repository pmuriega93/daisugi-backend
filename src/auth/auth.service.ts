import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto, ChangePasswordDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { nanoid } from 'nanoid';
import { ResetToken } from './entities/reset-token.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ResetToken)
    private readonly resetTokenRepository: Repository<ResetToken>,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async create(createUserDto: CreateUserDto, admin?: User) {
    try {
      const { password, roles, ...userData } = createUserDto;

      const userRoles = admin ? ['user'] : ['admin']

      const user = this.userRepository.create({
        ...userData,
        roles: userRoles,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, fullName: true, id: true, roles: true }, //! OJO!
    });

    if (!user || !user.isActive)
      throw new UnauthorizedException('Credenciales incorrectas');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas');

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async changePassword(user: User, password: ChangePasswordDto) {
    const u = await this.userRepository.findOne({
      where: { email: user.email },
      select: { email: true, password: true, id: true }, //! OJO!
    });
    if (!u)
      throw new UnauthorizedException('Credenciales incorrectas');

    if (!bcrypt.compareSync(password.oldPassword, u.password))
      throw new UnauthorizedException('Credenciales incorrectas');
    
    const newPassword = bcrypt.hashSync(password.newPassword, 10);

    u.password = newPassword;

    await this.userRepository.save(u);
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, id: true }, //! OJO!
    });

    if (user) {
      const resetToken = nanoid(64)
      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 1)

      const bdToken = this.resetTokenRepository.create({
        userId: user.id,
        token: resetToken,
        expiryDate
      })

      await this.resetTokenRepository.save(bdToken)

      this.mailerService.sendPasswordResetEmail(email, resetToken)
    }

    return { message: 'Si el usuario existe, recibirá un correo electrónico ' }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id)

    await this.userRepository.update(id, updateUserDto);
    
    return this.findOne(id)
  }


  async deleteUser(id: string) {
    await this.updateUser(id, { isActive: false })

    return `User with id ${id} deleted succesfully`
  }

  async findOne( id: string ) {
      const user = await this.userRepository.findOneBy({ id });

      if ( !user || !user.isActive ) 
        throw new NotFoundException(`User with id ${ id } not found`);
  
      return user;

  }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.resetTokenRepository.findOne({
      where: { token: resetToken },
    })

    if (!token)
      throw new UnauthorizedException('Link no válido')

    const tokenDate = token.expiryDate.getTime();
    const currentDate = new Date().getTime();

    if (tokenDate < currentDate)
      throw new UnauthorizedException('Link no válido')

    await this.resetTokenRepository.remove(token)

    const user = await this.userRepository.findOne({
      where: { id: token.userId }
    })

    if (!user)
      throw new UnauthorizedException('Usuario inexistente')

    user.password = bcrypt.hashSync(newPassword, 10)

    await this.userRepository.save(user);
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('chequear server logs');
  }
}
