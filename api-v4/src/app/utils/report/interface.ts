export interface ProductReport {
    id: number;
    name: string;
    unit_price: number;
    type: {
        id: number;
        name: string;
    };
    total_qty: number;
    total_sales: number;
}