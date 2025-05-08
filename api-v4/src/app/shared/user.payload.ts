interface UserPayload {
    id: number;
    name: string;
    phone: string;
    email: string;
    avatar: string;
    roles: {
        id: number;
        name: string;
        is_default: boolean;
    }[]
}

export default interface TokenPayload {
    user: UserPayload;
    iat: number;
    exp: number;
}