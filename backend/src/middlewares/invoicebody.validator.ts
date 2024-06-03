import { validationResult, check } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const validateInvoiceRequestBody = [
    check('sellerDetails.name').notEmpty().withMessage('Seller name is required'),
    check('sellerDetails.address').notEmpty().withMessage('Seller address is required'),
    check('sellerDetails.pan').notEmpty().withMessage('Seller PAN is required'),
    check('sellerDetails.gst').notEmpty().withMessage('Seller GST is required'),
    check('billingDetails.name').notEmpty().withMessage('Billing name is required'),
    check('billingDetails.address').notEmpty().withMessage('Billing address is required'),
    check('billingDetails.state_ut_code').notEmpty().withMessage('Billing state/UT code is required'),
    check('shippingDetails.name').notEmpty().withMessage('Shipping name is required'),
    check('shippingDetails.address').notEmpty().withMessage('Shipping address is required'),
    check('shippingDetails.state_ut_code').notEmpty().withMessage('Shipping state/UT code is required'),
    check('orderDetails.order_no').notEmpty().withMessage('Order number is required'),
    check('orderDetails.order_date').notEmpty().withMessage('Order date is required'),
    check('invoiceDetails.invoice_no').notEmpty().withMessage('Invoice number is required'),
    check('invoiceDetails.invoice_date').notEmpty().withMessage('Invoice date is required'),
    check('items').isArray().withMessage('Items should be an array'),
    check('items.*.description').notEmpty().withMessage('Item description is required'),
    check('items.*.unitPrice').isFloat({ gt: 0 }).withMessage('Item unit price should be greater than 0'),
    check('items.*.quantity').isInt({ gt: 0 }).withMessage('Item quantity should be greater than 0'),
    check('items.*.netAmount').isFloat({ gt: 0 }).withMessage('Item net amount should be greater than 0'),
    check('reverseCharge').isBoolean().withMessage('Reverse charge should be a boolean'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation failed', { errors: errors.array() });
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];