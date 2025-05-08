// ================================================================================================= Third Party Library
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

// ================================================================================================= Custom Library
import Role from './role.model';
import User from './user.model';

@Table({ tableName: 'user_roles', timestamps: false })
class UserRoles extends Model<UserRoles> {

    // ============================================================================================= Primary Key
    @Column({ primaryKey: true, autoIncrement: true })                                              id: number;

    // ============================================================================================= Foreign Key
    @ForeignKey(() => User) @Column({ onDelete: 'CASCADE' })                                        user_id: number;
    @ForeignKey(() => Role) @Column({ onDelete: 'CASCADE' })                                        role_id: number;
    @ForeignKey(() => User) @Column({ onDelete: 'CASCADE' })                                        added_id: number;

    // ============================================================================================= Field
    @Column({ allowNull: false, type: DataType.DATE })                                              created_at?: Date;
    @Column({ allowNull: false, type: DataType.BOOLEAN, defaultValue: false })                      is_default: boolean;
    
    // ============================================================================================= Many to One
    @BelongsTo(() => Role)                                                                          role: Role;
    @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })                                   user: User;
    @BelongsTo(() => User, { foreignKey: 'added_id', as: 'creator' })                               creator: User;

}

export default UserRoles;