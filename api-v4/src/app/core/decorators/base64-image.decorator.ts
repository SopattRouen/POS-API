// ================================================================>> Third Party Library
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * @author Yim Klok <yimklok.kh@gmail.com>
 * @params validationOptions
 * @noted This decorator create for use dto only
 */
export function IsBase64Image(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isBase64Image',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    const base64PrefixJPEG = 'data:image/jpeg;base64,';
                    const base64PrefixPNG = 'data:image/png;base64,';
                    return typeof value === 'string' && (value.startsWith(base64PrefixJPEG) || value.startsWith(base64PrefixPNG));
                },
                defaultMessage(_args: ValidationArguments) {
                    return 'Image must be a valid base64 encoded JPEG or PNG';
                },
            },
        });
    };
}
