// ================================================================================================= Third Party Library
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';

@Table({ tableName: 'user_log', createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at', paranoid: true, })
class UsersLogs extends Model<UsersLogs> {
    
    // ============================================================================================= Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                              id: number;

    // ============================================================================================= Foreign Key: User ID
    @ForeignKey(() => User) @Column({ type: DataType.INTEGER, allowNull: false })                   user_id: number;
    // Log Action
    @Column({ type: DataType.STRING, allowNull: false })                                            action: string;
    // Log Details
    @Column({ type: DataType.TEXT })                                                                details: string;
    // IP Address
    @Column({ type: DataType.STRING })                                                              ip_address: string;
    // Browser
    @Column({ type: DataType.STRING })                                                              browser: string;
    // Operating System
    @Column({ type: DataType.STRING })                                                              os: string;
    // Platform/Device Type
    @Column({ type: DataType.STRING })                                                              platform: string;
    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })                                    timestamp: Date;

    @BelongsTo(() => User)                                                                          user: User;
}

export default UsersLogs;
