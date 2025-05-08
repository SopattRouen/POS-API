// ===========================================================================>> Costom Library
import { Pagination } from "@app/shared/pagination.interface";
import User from "@app/models/user/user.model";
export interface List {
    data: User[],
    pagination: Pagination
}

export interface Create {
    data: User,
    message: string
}

export interface Update {
    data: User,
    message: string
}