import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    const port = configService.get('port')
    app.enableCors()
    await app.listen(port).then(() => {
        console.log(
            `App has been started, PORT:${port}, NODE_ENV: ${process.env.NODE_ENV}`
        )
    })
}
bootstrap()
