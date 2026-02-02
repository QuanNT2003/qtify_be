import { Global, Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { EntityModule } from 'src/model/entity/entity.module';
import { GenreService } from './genre.service';
import { ArtistService } from './artist.service';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [
    EntityModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '1d' },
    //   }),
    // }),
  ],
  providers: [GenreService, ArtistService, CloudinaryService],
  exports: [GenreService, ArtistService, CloudinaryService],
})
export class ServiceModule {}
