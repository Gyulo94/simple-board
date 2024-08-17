import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  signup() {
    return 'signup';
  }

  login() {
    return 'login';
  }

  me() {
    return 'me';
  }

  async getUsers() {
    return this.userRepository.find();
  }
}
