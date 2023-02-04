import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HttpJsonRpcConnector, LotusClient } from 'filecoin.js';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
let localNode;
let adminAuthToken;

localNode = 'http://127.0.0.1:1234/rpc/v0';
adminAuthToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.6hSKU05F78yi8QoF7q8DHilcCjFB_aA4nvvuvxM4lPg';

// adminAuthToken =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.BRe5of96dfyIFnj1VD38BbGMJzszCaF4MukrLUDqAm0';

const localConnector = new HttpJsonRpcConnector({
  url: localNode,
  token: adminAuthToken,
});
const lotusClient = new LotusClient(localConnector);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('offer')
  async createOffer(
    @Body('id')
    id: number,
    @Body('cid')
    cid: string,
    @Body('deadline')
    deadline: number,
    @Body('duration')
    duration: number,
    @Body('filAmount')
    filAmount: number,
    @Body('fileUrl')
    fileUrl: string,
  ) {
    await this.appService.createOffer(
      id,
      cid,
      deadline,
      duration,
      filAmount,
      fileUrl,
    );
    return;
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          console.log(`${name}-${randomName}${fileExtName}`);

          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async getCID(@UploadedFile() file: Express.Multer.File) {
    const importResult = await lotusClient.client.import({
      Path: join(__dirname, '..', file.path),
      IsCAR: false,
    });
    return {
      cid: importResult?.Root?.['/'],
      fileUrl: `https://apifvmhack.ballx86.com/${file?.path}`,
    };
  }
}
