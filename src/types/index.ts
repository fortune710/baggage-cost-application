export interface Transaction {
    id: string;
    amount: number;
    date: {
        nanoseconds: number;
        seconds: number;
    };
    issued_by: {
        id: string;
        name: string;
    };
    payment_id: string;
}
