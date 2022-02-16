// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User, UserDocument } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'

export type UserNoPassword = Omit<User, 'password'>

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    login(user: UserDocument) {
        const payload = { id: user._id }
        return {
            accessToken: this.jwtService.sign(payload),
        }
    }

    async refresh(id: string) {
        const user = await this.userService.findById(id)
        return this.login(user)
    }

    async validateUser(
        login: string,
        password: string
    ): Promise<UserNoPassword> {
        return this.userService.findOneByLoginAndPassword(login, password)
    }
}
