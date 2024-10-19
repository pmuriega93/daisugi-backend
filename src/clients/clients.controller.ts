import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Auth()
  create(
    @Body() createClientDto: CreateClientDto,
    @GetUser() user: User
  ) {
    return this.clientsService.create(createClientDto, user);
  }

  @Get()
  @Auth()
  findByUser(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.clientsService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
    @GetUser() user: User
  ) {
    return this.clientsService.update(id, updateClientDto, user);
  }

  @Delete(':id')
  @Auth()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.clientsService.remove(id, user);
  }
}
