import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  createOffer(
    id: number,
    cid: string,
    deadline: number,
    duration: number,
    filAmount: number,
    fileUrl: string,
  ) {
    const offer = new Offer();
    offer.id = id;
    offer.cid = cid;
    offer.deadline = deadline;
    offer.duration = duration;
    offer.filAmount = filAmount;
    offer.fileUrl = fileUrl;
    return this.offersRepository.save(offer);
  }
}
