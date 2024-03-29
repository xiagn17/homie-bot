import { EntityRepository, Repository } from 'typeorm';
import { PaymentEntity } from '../entities/Payment.entity';
import { PaymentStatusInterface } from '../interfaces/payment-status.interface';
import { PaymentItemInterface } from '../interfaces/payment-item.interface';

@EntityRepository(PaymentEntity)
export class PaymentsRepository extends Repository<PaymentEntity> {
  async createAndSave(data: {
    status: PaymentStatusInterface;
    item: PaymentItemInterface;
    orderId: string;
    telegramUserId: string;
  }): Promise<PaymentEntity> {
    const paymentEntity = await this.save(
      this.create({
        status: data.status,
        item: data.item,
        orderId: data.orderId,
        telegramUserId: data.telegramUserId,
      }),
    );

    return paymentEntity;
  }
}
