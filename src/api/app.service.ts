import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'src/config';
import { AllExceptionFilter } from 'src/infrastructure/exiption/all.exeption';

export class Application {
  static async start() {
    const PORT = Number(config.API_PORT);
    const app = await NestFactory.create(AppModule, {cors: true});

    app.useGlobalFilters(new AllExceptionFilter());

    const prefix = 'api/v1';
    app.setGlobalPrefix(prefix);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transform: true,
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Nasiya-App')
      .setDescription('Nasiya-App')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(prefix, app, document);

    await app.listen(PORT, () => console.log(`🚀 Server running on:`, PORT));
  }
}
