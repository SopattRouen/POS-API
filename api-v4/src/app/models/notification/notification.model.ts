// ================================================================================================= Third Party Library
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

// ================================================================================================= Custom Library
import Order from '@app/models/order/order.model';
import User from '@app/models/user/user.model';

@Table({ tableName: 'notifications', timestamps: true })
class Notifications extends Model<Notifications> {

    // ============================================================================================= Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                              id: number;

    // ============================================================================================= Foreign Key
    @ForeignKey(() => Order) @Column({ onDelete: 'CASCADE' })                                       order_id: number;
    @ForeignKey(() => User) @Column({ onDelete: 'CASCADE' })                                        user_id: number;
    
    // ============================================================================================= Field
    @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: false })                      read: boolean;
    
    // ============================================================================================= Many to One
    @BelongsTo(() => Order)                                                                         order: Order;
    @BelongsTo(() => User)                                                                          user: User;

}

export default Notifications;