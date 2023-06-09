import { Controller, Post, Get, Res, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express'

import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter,fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {}


  @Get('product/:imageName')
  findFile(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path =  this.filesService.getStaticProductImage(imageName);

    // Retorno el archivo
    res.sendFile(path)
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter : fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  })
  )
  uploadFile( 
    @UploadedFile() file: Express.Multer.File 
    ){

      if (!file) {
        throw new BadRequestException(`Make sure that the file is an image`);
      }

      const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
      
      return {
        fileName: secureUrl
      };
  }
}
