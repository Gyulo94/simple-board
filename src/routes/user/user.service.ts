import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Board } from 'src/entity/board.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const { username, name, password } = dto;

    const encryptPassword = await this.encryptPasword(password);
    return this.userRepository.save({
      username,
      name,
      password: encryptPassword,
    });
  }

  async getUserByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async login(dto: LoginUserDto) {
    const { username, password } = dto;

    const user = await this.userRepository.findOneBy({ username });

    if (!user)
      throw new HttpException(
        '해당 유저가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );

    const isMatch = await compare(password, user.password);

    if (!isMatch)
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = {
      username,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, 'secret-key', { expiresIn: '1h' });

    return accessToken;
  }

  me() {
    return 'me';
  }

  async getUsers() {
    const qb = this.userRepository.createQueryBuilder();

    qb.addSelect((subQuery) => {
      return subQuery
        .select('count(id)')
        .from(Board, 'Board')
        .where('Board.userId = User.id');
    }, 'User_boardCount');

    return qb.getMany();
  }

  async encryptPasword(password: string) {
    const DEFAULT_SALT = 11;
    return hash(password, DEFAULT_SALT);
  }
}
