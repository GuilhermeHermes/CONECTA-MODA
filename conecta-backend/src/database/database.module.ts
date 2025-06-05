import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5433),
        username: configService.get('DB_USERNAME', 'conecta'),
        password: configService.get('DB_PASSWORD', 'conecta'),
        database: configService.get('DB_DATABASE', 'conecta_db'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        // Adiciona configuração SSL para conexão segura
        ssl: configService.get('NODE_ENV') === 'production' 
          ? { 
              rejectUnauthorized: false 
            } 
          : false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}