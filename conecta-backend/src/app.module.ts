import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5433),
        username: configService.get('DB_USERNAME', 'conecta'),
        password: configService.get('DB_PASSWORD', 'conecta'),
        database: configService.get('DB_DATABASE', 'conecta_db'),
        entities: [User],
        synchronize: configService.get('NODE_ENV', 'development') !== 'production',
        dropSchema: configService.get('NODE_ENV', 'development') === 'development' && 
                    configService.get('DROP_SCHEMA', 'false') === 'true',
        logging: configService.get('NODE_ENV', 'development') === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
