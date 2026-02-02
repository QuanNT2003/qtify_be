import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });
  const config = new DocumentBuilder()
    .setTitle('Qtify API')
    .setDescription('Danh sách các API cho hệ thống backend')
    .setVersion('1.0')
    .addTag('qtify') // Bạn có thể thêm tag để phân loại API
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Đường dẫn để truy cập Swagger UI (ví dụ: localhost:3000/api)
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.NODE_PORT || 8080);
  console.log('Application is running on: http://localhost:8080/api');
  console.log('Swagger documentation: http://localhost:8080/docs');
}
void bootstrap();
