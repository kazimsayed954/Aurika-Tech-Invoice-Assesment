import express from 'express';
import { validateInvoiceRequestBody } from '../middlewares/invoicebody.validator';
import { invoiceController } from '../controllers/invoice.controllers';
const router = express.Router();
router.post("/",validateInvoiceRequestBody,invoiceController);

export default router