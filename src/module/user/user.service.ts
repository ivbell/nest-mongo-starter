import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './entities/user.entity'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt')

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const { login, password } = createUserDto
        try {
            const candidate = await this.userModel.findOne({ login: login })
            if (candidate) {
                return new HttpException(
                    'Login not corrected',
                    HttpStatus.BAD_REQUEST
                )
            }

            const bcryptPassword = await bcrypt.hash(password, 15)

            await this.userModel.create({
                ...createUserDto,
                password: bcryptPassword,
            })

            return new HttpException(
                `User ${login} created`,
                HttpStatus.ACCEPTED
            )
        } catch (error) {
            throw new HttpException(
                'Error registration, try  again',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    async returnUserNoPassword(id: string): Promise<User> {
        return this.userModel.findById(id).select('-password').exec()
    }

    async findOneByLoginAndPassword(
        login: string,
        password: string
    ): Promise<User | undefined> {
        const user = await this.userModel.findOne({ login: login })
        if (!user) {
            return null
        }
        const pass = await bcrypt.compare(password, user.password)
        if (user && pass) {
            return this.returnUserNoPassword(user._id)
        }

        return null
    }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async findUser(user): Promise<User> {
        return await this.userModel.findById(user.id).exec()
    }
}
