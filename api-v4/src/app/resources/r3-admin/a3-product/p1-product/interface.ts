import { Pagination } from "@app/shared/pagination.interface";
import Product from "@app/models/product/product.model";

export interface List {
    status: string;
    data: Product[];
    pagination: Pagination;
}
