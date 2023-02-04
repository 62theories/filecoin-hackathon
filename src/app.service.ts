import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
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
    filAmount: string,
    fileUrl: string,
    size: number,
  ) {
    const offer = new Offer();
    offer.id = id;
    offer.cid = cid;
    offer.deadline = deadline;
    offer.duration = duration;
    offer.filAmount = filAmount;
    offer.fileUrl = fileUrl;
    offer.size = size;
    return this.offersRepository.save(offer);
  }

  getOffers() {
    return this.offersRepository.find();
  }

  async getPendingOffers() {
    const offers = await this.offersRepository.find({
      where: {
        deadline: MoreThanOrEqual(parseInt(String(Date.now() / 1000))),
      },
    });
    return offers;
  }

  async getCompletedOffers() {
    const offers = await this.offersRepository.find({
      where: {
        deadline: LessThan(parseInt(String(Date.now() / 1000))),
      },
    });
    return offers;
  }

  getOffer(id: number) {
    return this.offersRepository.findOne({
      where: {
        id,
      },
    });
  }
}
