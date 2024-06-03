// src/types/invoice.ts
export interface Item {
    description: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    netAmount: number;
}

export interface SellerDetails {
    name: string;
    address: string;
    pan: string;
    gst: string;
}

export interface BillingDetails {
    name: string;
    address: string;
    state_ut_code: string;
}

export interface ShippingDetails {
    name: string;
    address: string;
    state_ut_code: string;
}

export interface OrderDetails {
    order_no: string;
    order_date: string;
}

export interface InvoiceDetails {
    invoice_no: string;
    invoice_date: string;
}

export interface InvoiceData {
    sellerDetails: SellerDetails;
    billingDetails: BillingDetails;
    shippingDetails: ShippingDetails;
    orderDetails: OrderDetails;
    invoiceDetails: InvoiceDetails;
    items: Item[];
    reverseCharge: boolean;
}
