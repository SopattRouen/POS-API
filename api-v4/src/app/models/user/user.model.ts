// ================================================================================================= Third Party Library
import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';

// ================================================================================================= Custom Library
import { ActiveEnum } from 'src/app/enums/active.enum';

import Order        from '../order/order.model';
import Product      from '../product/product.model';

import UserRoles    from './user_roles.model';
import Role         from './role.model';
import UserOTP      from './user_otps.model';

@Table({ tableName: 'user', createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at', paranoid: true })
class User extends Model<User> {

    // ============================================================================================= Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                              id: number;

    // ============================================================================================= Field
    @Column({ allowNull: true, type: DataType.STRING(200), defaultValue: 'static/avatar.png' })     avatar: string;
    @Column({ allowNull: false, type: DataType.STRING(50) })                                        name: string;
    @Column({ allowNull: true, type: DataType.STRING(100) })                                        email: string;
    @Column({ allowNull: false,type: DataType.STRING(100) })                                        phone: string;
    @Column({ allowNull: false, type: DataType.STRING(100), set(value: string) 
        {const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        },
    })                                                                                              password: string;
    @Column({ allowNull: false, type: DataType.INTEGER, defaultValue: ActiveEnum.ACTIVE })          is_active: ActiveEnum;
    @Column({ allowNull: true, type: DataType.INTEGER })                                            creator_id: number;
    @Column({ allowNull: true, type: DataType.INTEGER })                                            updater_id: number;

    // ===========================================================================================>> Many to One
    @BelongsTo(() => User, { foreignKey: 'creator_id', as: 'creator' })                             creator: User;
    @BelongsTo(() => User, { foreignKey: 'updater_id', as: 'updater' })                             updater: User;
    @Column({ allowNull: true, type: DataType.DATE, defaultValue: new Date() })                     last_login?: Date;
    created_at: Date
    // ===========================================================================================>> One to Many
    @HasMany(() => UserRoles)                                                                       role: UserRoles[];
    @HasMany(() => Order)                                                                           orders: Order[];
    @HasMany(() => Product)                                                                         create_pos: Product[];
    @HasMany(() => UserOTP)                                                                         otps: UserOTP[];
    // ===========================================================================================>> Many to Many
    @BelongsToMany(() => Role, () => UserRoles)                                                     roles: Role[];
}
export default User;
