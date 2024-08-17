import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  signup() {
    return 'signup';
  }

  login() {
    return 'login';
  }

  me() {
    return 'me';
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
