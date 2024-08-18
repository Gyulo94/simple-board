import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/entity/board.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async findAll() {
    return this.boardRepository.find();
  }

  async find(id: number) {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!board)
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    return board;
  }

  create(dto: CreateBoardDto) {
    return this.boardRepository.save(dto);
  }

  async update(userId: number, id: number, dto: UpdateBoardDto) {
    const board = await this.getBoardById(id);

    if (!board)
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );

    if (userId !== board.userId) {
      throw new UnauthorizedException();
    }

    return this.boardRepository.update(id, { ...dto });
  }

  async delete(userId: number, id: number) {
    const board = await this.getBoardById(id);

    if (!board)
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );

    if (userId !== board.userId) {
      throw new UnauthorizedException();
    }

    return this.boardRepository.remove(board);
  }

  async getBoardById(id: number) {
    return this.boardRepository.findOneBy({ id });
  }
}
