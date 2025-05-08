// ===========================================================================>> Core Library
import User from '@app/models/user/user.model';
import { BadRequestException, Injectable } from '@nestjs/common';

// ===========================================================================>> Costom Library
import { JwtTokenGenerator, TokenGenerator } from '@app/shared/jwt/token';
import Role from '@app/models/user/role.model';
import UsersLogs from '@app/models/user/user_logs.model';
import { FileService } from 'src/app/services/file.service';
import { UpdatePasswordDto, UpdateUserDto } from './dto';
import { List } from './interface';

@Injectable()
export class ProfileService {
    private tokenGenerator: TokenGenerator;
    constructor(
        private readonly fileService: FileService,
    ) { this.tokenGenerator = new JwtTokenGenerator() };

    private isValidBase64(str: string): boolean {
        const base64Pattern = /^data:image\/(jpeg|png|gif|bmp|webp);base64,[a-zA-Z0-9+/]+={0,2}$/;
        return base64Pattern.test(str);
    }

    async update(userId: number, body: UpdateUserDto): Promise<{ token: string; message: string }> {
        try {
            // Check if avatar is provided and it's not already a file URI (i.e., it's a base64 string)
            if (body.avatar && !body.avatar.startsWith('upload/file/')) {
                if (this.isValidBase64(body.avatar)) {
                    // Upload the base64 avatar image
                    const result = await this.fileService.uploadBase64Image('user', body.avatar);
                    if (result.error) {
                        // Throw an error if the upload fails
                        throw new BadRequestException(result.error);
                    }
                    // Replace the base64 string with the file URI from the file service
                    body.avatar = result.file?.uri;
                } else {
                    // Throw an error if the base64 image format is invalid
                    throw new BadRequestException('Invalid image format');
                }
            }

            // Update the user's information (including avatar, if applicable)
            await User.update({
                name: body.name,
                email: body.email,
                phone: body.phone,
                avatar: body.avatar
            }, { where: { id: userId } });

            // Fetch the updated user details (including their roles)
            const user = await User.findByPk(userId, {
                attributes: ['id', 'name', 'avatar', 'phone', 'email', 'password', 'created_at'],
                include: [Role] // Include related roles
            });

            if (!user) {
                throw new BadRequestException('User not found');
            }

            // Generate a new token for the updated user
            const token = this.tokenGenerator.getToken(user);

            // Return the new token and a success message
            return {
                token: token,
                message: 'Profile updated successfully'
            };

        } catch (error) {
            // Handle and throw specific errors
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Something went wrong during the update process.');
        }
    }


    async updatePassword(userId: number, body: UpdatePasswordDto): Promise<{ message: string }> {
        //=============================================
        let currentUser: User;
        try {
            currentUser = await User.findByPk(userId);
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
        if (!currentUser) {
            throw new BadRequestException('Invalid user_id');
        }

        if (body.password !== body.confirm_password) {
            throw new BadRequestException('Passwords and Confirm password do not match');
        }
        //=============================================
        try {
            await User.update({
                password: body.confirm_password,
            }, {
                where: { id: userId }
            });
        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Update');
        }

        //=============================================
        return { message: 'Password has been updated successfully.' };
    }

    async listingLogs(userId: number, page_size, page) {
        try {
            const offset = (page - 1) * page_size;
            // Build the dynamic `where` clause with filters
            const where: any = {
                user_id: userId,
            };

            const data = await UsersLogs.findAll({
                attributes: ['id', 'action', 'details', 'ip_address', 'browser', 'os', 'platform', 'timestamp'],
                where: where,
                order: [['id', 'DESC']],
                limit: page_size,
                offset,
            });

            const totalCount = await UsersLogs.count({
                where: where,
            });

            const totalPages = Math.ceil(totalCount / page_size);

            const dataFormat: List = {
                status: 'success',
                data: data,
                pagination: {
                    page: page,
                    limit: page_size,
                    totalPage: totalPages,
                    total: totalCount,
                },
            };

            return dataFormat;

        } catch (error) {
            throw new BadRequestException('Someting went wrong!. Please try again later.', 'Error Query');
        }
    }
}
