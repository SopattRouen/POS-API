// ================================================================================================= Third Party Library
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';

// ================================================================================================= Custom Library

@Table({ tableName: 'telegram', createdAt: 'created_at', updatedAt: 'updated_at' })
class Telegram extends Model<Telegram> {

    // ============================================================================================= Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                              id: number;

    // ============================================================================================= Foreign Key
    @ForeignKey(() => User) @Column({ onDelete: 'CASCADE' })                                        user_id: number;

    // ============================================================================================= Field
    @Column({ allowNull: true, type: DataType.STRING(50) })                                         first_name  : string;
    @Column({ allowNull: true, type: DataType.STRING(50) })                                         last_name   : string;
    @Column({ allowNull: false, type: DataType.STRING(50) })                                        username    : string;
    @Column({ allowNull: false, type: DataType.INTEGER , unique: true,})                            chat_id     : number;
    @Column({ allowNull: false, type: DataType.BOOLEAN , defaultValue: false})                      is_verify   : boolean;

    // ============================================================================================= Many to One
    @BelongsTo(() => User)                                                                          user: User;
}

export default Telegram;