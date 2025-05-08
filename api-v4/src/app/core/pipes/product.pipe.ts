// ================================================================>> Core Library
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// ================================================================>> Costom Library
import ProductType from '@app/models/product/type.model';

@Injectable()
export class ProductTypeExistsPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body' && value?.type_id) {
            const typeId = value.type_id;
            // Query the database to check if the type_id exists in the products_type table
            const type = await ProductType.findByPk(typeId);
            if (!type) {
                throw new BadRequestException(`Invalid type_id value: ${typeId}`);
            }
        }
        // Return the value if it is valid
        return value;
    }
}
