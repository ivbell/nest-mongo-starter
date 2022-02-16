import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService, UserNoPassword } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'login',
            passwordField: 'password',
        })
    }

    async validate(
        login: string,
        password: string
    ): Promise<UserNoPassword | any> {
        if (!password) {
            throw new HttpException(
                'Please take password',
                HttpStatus.BAD_REQUEST
            )
        }
        const user = await this.authService.validateUser(login, password)

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
