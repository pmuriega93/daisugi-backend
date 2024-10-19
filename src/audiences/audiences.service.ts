import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { UpdateAudienceDto } from './dto/update-audience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Audience } from './entities/audience.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class AudiencesService {

  constructor(
    @InjectRepository(Audience)
    private readonly audienceRepository: Repository<Audience>,
  ) {}

 async create(createAudienceDto: CreateAudienceDto, user: User) {
    try {
      const audienceDetails = createAudienceDto;

      const audience = this.audienceRepository.create({
        ...audienceDetails,
        user
      });

      await this.audienceRepository.save(audience)
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user?: User) {
    const { limit = 10, offset = 0 } = paginationDto;

    const audiences = await this.audienceRepository.find({
      take: limit,
      skip: offset,
    });

    if (user)
      return audiences.filter(audience => audience.user.id === user.id)

    return audiences;
  }

  async findOne(description: string) {
    const audience = await this.audienceRepository.findOneBy( { description } );

    if (!audience)
      throw new NotFoundException(`Audience ${ description } not found`);

    return audience;
  }

  update(id: number, updateAudienceDto: UpdateAudienceDto) {
    return `This action updates a #${id} audience`;
  }

  remove(id: number) {
    return `This action removes a #${id} audience`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
