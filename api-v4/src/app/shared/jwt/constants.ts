import * as dotenv from 'dotenv';
dotenv.config();

const jwtConstants = {
    expiresIn: 3600 * 24,
    secret: process.env.JWT_SECRET as string,
};

export default jwtConstants;
