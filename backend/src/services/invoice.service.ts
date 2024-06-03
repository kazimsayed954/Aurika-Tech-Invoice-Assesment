import { PDFDocument, StandardFonts, PDFFont } from 'pdf-lib';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import { InvoiceData } from '../types/invoiceBody.type';

const invoicesDir = path.join(__dirname, '../../public/invoices');

const wrapText = (text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] => {
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

export const invoiceService = async (invoiceData: InvoiceData,req:Request) => {
    try {
        // Ensure the invoices directory exists
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir);
            logger.info('Invoices directory created');
        }

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
        const { width, height } = page.getSize();
        
        // Load a standard font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 10;

        // Add the logo
        const logoUrl = path.join(__dirname, '../../public/assets/image_test.png');
        const logoImageBytes = fs.readFileSync(logoUrl);
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        page.drawImage(logoImage, {
            x: 50,
            y: height - 100,
            width: 100,
            height: 55
        });

        // Add headers
        page.drawText('Tax Invoice/Bill of Supply/Cash Memo', { x: 200, y: height - 50, size: 12, font });
        page.drawText('(Original for Recipient)', { x: 200, y: height - 65, size: 10, font });

        // Add seller details
        let yOffset = height - 130;
        page.drawText('Sold By:', { x: 50, y: yOffset, size: 10, font });
        wrapText(invoiceData.sellerDetails.name, font, fontSize, 200).forEach((line, index) => {
            page.drawText(line, { x: 120, y: yOffset - (index * 15), size: 10, font });
        });
        yOffset -= 15 * 2;
        wrapText(invoiceData.sellerDetails.address, font, fontSize, 200).forEach((line, index) => {
            page.drawText(line, { x: 120, y: yOffset - (index * 15), size: 10, font });
        });
        yOffset -= 15 * 2;
        page.drawText(`PAN No: ${invoiceData.sellerDetails.pan}`, { x: 120, y: yOffset, size: 10, font });
        yOffset -= 15;
        page.drawText(`GST Registration No: ${invoiceData.sellerDetails.gst}`, { x: 120, y: yOffset, size: 10, font });

        // Add billing and shipping details
        yOffset = height - 130;
        page.drawText('Billing Address:', { x: 300, y: yOffset, size: 10, font });
        wrapText(invoiceData.billingDetails.name, font, fontSize, 200).forEach((line, index) => {
            page.drawText(line, { x: 400, y: yOffset - (index * 15), size: 10, font });
        });
        yOffset -= 15 * (wrapText(invoiceData.billingDetails.name, font, fontSize, 200).length);
        wrapText(invoiceData.billingDetails.address, font, fontSize, 200).forEach((line, index) => {
            page.drawText(line, { x: 400, y: yOffset - (index * 15), size: 10, font });
        });
        yOffset -= 15 * (wrapText(invoiceData.billingDetails.address, font, fontSize, 200).length);
        page.drawText(`State/UT Code: ${invoiceData.billingDetails.state_ut_code}`, { x: 400, y: yOffset, size: 10, font });

        yOffset -= 30;
        page.drawText('Shipping Address:', { x: 300, y: yOffset, size: 10, font });
        wrapText(invoiceData.shippingDetails.name, font, fontSize, 200).forEach((line, index) => {
            page.drawText(line, { x: 400, y: yOffset - (index * 15), size: 10, font });
        });
        yOffset -= 15 * (wrapText(invoiceData.shippingDetails.name, font, fontSize, 200).length);
        wrapText(invoiceData.shippingDetails.address, font, fontSize, 200).forEach((line, index) => {
            page.drawText(line, { x: 400, y: yOffset - (index * 15), size: 10, font });
        });
        yOffset -= 15 * (wrapText(invoiceData.shippingDetails.address, font, fontSize, 200).length);
        page.drawText(`State/UT Code: ${invoiceData.shippingDetails.state_ut_code}`, { x: 400, y: yOffset, size: 10, font });

        // Add order details
        yOffset = height - 220;
        page.drawText(`Order Number: ${invoiceData.orderDetails.order_no}`, { x: 50, y: yOffset, size: 10, font });
        yOffset -= 15;
        page.drawText(`Order Date: ${invoiceData.orderDetails.order_date}`, { x: 50, y: yOffset, size: 10, font });

        // Add invoice details
        yOffset -= 15;
        page.drawText(`Invoice Number: ${invoiceData.invoiceDetails.invoice_no}`, { x: 50, y: yOffset, size: 10, font });
        yOffset -= 15;
        page.drawText(`Invoice Date: ${invoiceData.invoiceDetails.invoice_date}`, { x: 50, y: yOffset, size: 10, font });

        // Add table headers
        yOffset -= 30;
        yOffset -= 20 * (invoiceData?.items?.length + 1);

        const headers = ['Sl. No', 'Description', 'Unit Price', 'Qty', 'Net Amount', 'Tax Rate', 'Tax Type', 'Tax Amount', 'Total Amount'];
        const headerXPositions = [50, 100, 250, 300, 350, 400, 450, 500, 550];
        headers.forEach((header, index) => {
            page.drawText(header, { x: headerXPositions[index], y: yOffset, size: 10, font });
        });

        yOffset -= 15;

        // Add items
        invoiceData.items.forEach((item, index) => {
            const itemLines = wrapText(item.description, font, fontSize, 150);
            page.drawText(`${index + 1}`, { x: 50, y: yOffset, size: 10, font });
            itemLines.forEach((line, lineIndex) => {
                page.drawText(line, { x: 100, y: yOffset - (lineIndex * 15), size: 10, font });
            });
            page.drawText(`${item.unitPrice.toFixed(2)}`, { x: 250, y: yOffset, size: 10, font });
            page.drawText(`${item.quantity}`, { x: 300, y: yOffset, size: 10, font });
            page.drawText(`${item.netAmount.toFixed(2)}`, { x: 350, y: yOffset, size: 10, font });
            page.drawText(`2.5%`, { x: 400, y: yOffset, size: 10, font }); // Example tax rate
            page.drawText(`CGST`, { x: 450, y: yOffset, size: 10, font }); // Example tax type
            page.drawText(`${(item.netAmount * 0.025).toFixed(2)}`, { x: 500, y: yOffset, size: 10, font }); // Example tax amount
            page.drawText(`${(item.netAmount + item.netAmount * 0.025).toFixed(2)}`, { x: 550, y: yOffset, size: 10, font }); // Example total amount
            yOffset -= 15 * (itemLines.length + 1);
        });

        // Add totals and amount in words
        yOffset -= 15;
        page.drawText('TOTAL:', { x: 50, y: yOffset, size: 10, font });
        const totalAmount = invoiceData.items.reduce((sum, item) => sum + item.netAmount + item.netAmount * 0.025, 0); // Example calculation
        page.drawText(`${totalAmount.toFixed(2)}`, { x: 550, y: yOffset, size: 10, font });

        yOffset -= 15;
        const totalAmountInWords = `One Thousand One Hundred And Ninety-five only`; // Example
        page.drawText('Amount in Words:', { x: 50, y: yOffset, size: 10, font });
        page.drawText(totalAmountInWords, { x: 150, y: yOffset, size: 10, font });

        // Add footer
        yOffset -= 30;
        page.drawText('Whether tax is payable under reverse charge - No', { x: 50, y: yOffset, size: 10, font });

        yOffset -= 30;
        page.drawText(`For ${invoiceData.sellerDetails.name}:`, { x: 50, y: yOffset, size: 10, font });

        // Insert signature image
        const signaturePath = path.join(__dirname, '../../public/assets/image_test.png');
        const signatureImageBytes = fs.readFileSync(signaturePath);
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
        page.drawImage(signatureImage, {
            x: 350,
            y: yOffset - 30,
            width: 100,
            height: 55
        });
        page.drawText('Authorized Signatory', { x: 350, y: yOffset - 45, size: 10, font });

        // Save the PDF with a unique filename
        const uniqueId = uuidv4();
        const pdfPath = path.join(invoicesDir, `invoice-${uniqueId}.pdf`);
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(pdfPath, pdfBytes);
        logger.info('PDF generated successfully', { pdfPath });

        const pdfUrl = `${req.protocol}://${req.get('host')}/public/invoices/invoice-${uniqueId}.pdf`;

        return { message: 'Invoice generated successfully', invoiceId: uniqueId, pdfPath, pdfUrl };

    } catch (error) {
        logger.error('Error generating invoice', { error });
        console.error('Error generating invoice:', error);
        throw new Error('Could not generate invoice');
    }
};
