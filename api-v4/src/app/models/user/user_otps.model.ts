// user_otp.model.ts
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';

@Table({ tableName: 'user_otps', timestamps: true })
export class UserOTP extends Model<UserOTP> {
  @Column({ primaryKey: true, autoIncrement: true })                            id: number;

  @ForeignKey(() => User) @Column({ allowNull: false })                         user_id: number;

  @Column({ allowNull: false, type: DataType.STRING(6) })                       otp: string;
  @Column({ allowNull: false, type: DataType.DATE })                            expires_at: Date;

  @BelongsTo(() => User)                                                        user: User;
}

export default UserOTP;
