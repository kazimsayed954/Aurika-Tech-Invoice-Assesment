import { Request, Response } from 'express';
import { invoiceService } from '../services/invoice.service';
import logger from '../utils/logger';

export const invoiceController = async(req: Request, res: Response)=>{
    try {
        const invoiceData = req.body;

        // Generate the invoice PDF
        const { message, invoiceId, pdfPath,pdfUrl } = await invoiceService(invoiceData,req);
        logger.info('Invoice generated successfully', { invoiceId, pdfPath,pdfUrl });
        res.status(200).send({ message, invoiceId,pdfUrl });
    } catch (error) {
        logger.error('Could not generate invoice', { error });
        res.status(500).send({ error: 'Could not generate invoice' });
    }

}