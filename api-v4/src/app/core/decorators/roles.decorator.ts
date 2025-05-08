// ================================================================>> Core Library
import { RoleEnum } from "@app/enums/role.enum";
import { SetMetadata } from "@nestjs/common";

/**
 * @author Yim Klok <yimklok.kh@gmail.com>
 * @params Array<role>
 */
export const RolesDecorator = (...roles: RoleEnum[]) => SetMetadata('roles', roles)