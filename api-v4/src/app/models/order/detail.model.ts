
// ================================================================================================= Third Party Library
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

// ================================================================================================= Custom Library
import Product from '../product/product.model';
import Order from './order.model';

@Table({ tableName: 'order_details', createdAt: 'created_at', updatedAt: 'updated_at' })
class OrderDetails extends Model<OrderDetails> {

    // ============================================================================================= Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                              id: number;

    // ============================================================================================= Foreign Key
    @ForeignKey(() => Order) @Column({ onDelete: 'CASCADE' })                                       order_id: number;
    @ForeignKey(() => Product) @Column({ onDelete: 'CASCADE' })                                     product_id: number;

    @Column({ allowNull: true, type: DataType.DOUBLE })                                             unit_price?: number;
    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: 0 })                          qty: number;
    created_at: Date
    // ============================================================================================= Many to One
    @BelongsTo(() => Order)                                                                         order: Order;
    @BelongsTo(() => Product)                                                                       product: Product;
}

export default OrderDetails;