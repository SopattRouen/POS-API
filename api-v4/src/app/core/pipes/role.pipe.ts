// ================================================================>> Core Library
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// ================================================================>> Costom Library
import Role from '@app/models/user/role.model';

@Injectable()
export class RoleExistsPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body' && value?.role_id) {
            const roleId = value.role_id;
            // Query the database to check if the role_id exists in the users_role table
            const role = await Role.findByPk(roleId);
            if (!role) {
                throw new BadRequestException(`Invalid role_id value: ${roleId}`);
            }
        }
        // Return the value if it is valid
        return value;
    }
}
