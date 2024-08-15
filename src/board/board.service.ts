import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  private boards = [
    { name: '제목1', contents: '내용1', id: 1 },
    { name: '제목2', contents: '내용2', id: 2 },
    { name: '제목3', contents: '내용3', id: 3 },
    { name: '제목4', contents: '내용4', id: 4 },
    { name: '제목5', contents: '내용5', id: 5 },
  ];
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

  async update(id: number, dto: UpdateBoardDto) {
    const board = await this.boardRepository.findOneBy({ id });

    if (!board)
      throw new HttpException(
        '게시글을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );

    return this.boardRepository.update(id, { ...dto });
  }

  delete(id: number) {
    const index = this.getBoardId(id);
    if (index > -1) {
      const deleteBoard = this.boards[index];
      this.boards.splice(index, 1);
      return deleteBoard;
    }
    return null;
  }

  getBoardId(id: number) {
    return this.boards.findIndex((board) => board.id === id);
  }

  getNextId() {
    return this.boards.sort((a, b) => b.id - a.id)[0].id + 1;
  }
}
