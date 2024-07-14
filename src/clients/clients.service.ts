import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Client } from './entities/client.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    // @InjectRepository(ProductImage)
    // private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createClientDto: CreateClientDto, user: User) {
    try {
      const clientDetails = createClientDto;
      const client = this.clientRepository.create({
        ...clientDetails,
        user
      });

      await this.clientRepository.save(client);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const clients = await this.clientRepository.find({
      take: limit,
      skip: offset,
    });

    return clients;
  }
  async findOne( term: string ) {

    let client: Client;

    if ( isUUID(term) ) {
      client = await this.clientRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.clientRepository.createQueryBuilder('prod'); 
      client = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images','prodImages')
        .getOne();
    }


    if ( !client ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return client;
  }


  async update(id: string, updateClientDto: UpdateClientDto, user: User) {
    const toUpdate = updateClientDto;

    const client = await this.clientRepository.preload({ id, ...toUpdate });

    if (!client) throw new NotFoundException('Client with id: ' + id + 'not found') 

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        client.user = user;
        await queryRunner.manager.save(client);
        await queryRunner.commitTransaction();
        await queryRunner.release();
        
        return this.findOne(id)
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleDBExceptions(error);
      }
  }

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.clientRepository.remove( product );
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
