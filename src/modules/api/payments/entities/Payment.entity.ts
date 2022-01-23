import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStatusInterface } from '../interfaces/payment-status.interface';

@Entity({ name: 'payments' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'payment_id' })
  readonly id: string;

  @Column({ name: 'item', type: 'varchar' })
  readonly item: string;

  @Column({ name: 'order_id', type: 'uuid' })
  readonly orderId: string;

  @Column({
    type: 'enum',
    name: 'status',
    nullable: false,
    enum: PaymentStatusInterface,
  })
  readonly status: PaymentStatusInterface;

  @Column({ name: 'telegram_user_id', type: 'uuid', nullable: false, unique: true })
  readonly telegramUserId: string;
}
