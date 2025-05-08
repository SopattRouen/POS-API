import { Pagination } from "@app/shared/pagination.interface";
import UsersLogs from "@app/models/user/user_logs.model";

export interface List {
    status: string;
    data: UsersLogs[];
    pagination: Pagination;
}
