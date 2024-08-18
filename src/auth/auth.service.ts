import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/routes/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);

    if (user) {
      const isMatch = await compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      name: user.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
