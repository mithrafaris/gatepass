import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useLocation, useNavigate } from 'react-router-dom';

const Pdf = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;

  useEffect(() => {
    if (!customer) {
      console.error('No customer data found:', customer);
      navigate(-1);
      return;
    }

    const generatePDF = () => {
      try {
        const doc = new jsPDF();

        // Add company header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Bridgeway Motors LLP', doc.internal.pageSize.width / 2, 20, { align: 'center' });

        // Add invoice title
        doc.setFontSize(16);
        doc.text('MATERIAL GATE PASS INVOICE', doc.internal.pageSize.width / 2, 30, { align: 'center' });

        // Add pass number and date
        doc.setFontSize(12);
        doc.text(`Pass Number: ${customer.PassNumber}`, 14, 40); // Changed from passNumber to PassNumber
        doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, 40, { align: 'right' });

        // Customer information table
        doc.autoTable({
          startY: 50,
          head: [['Customer Information']],
          body: [
            ['Name:', customer.customerName],
            ['Address:', customer.customerAddress],
            ['Out Date:', customer.OutDate], // Changed from outDate to OutDate
            ['Return Date:', customer.ReturnDate], // Changed from returnDate to ReturnDate
          ],
          theme: 'plain',
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 14 }
        });

        // Materials table
        const materialsTableHeaders = [['Material Name', 'Quantity']];
        const materialsTableBody = customer.materials.map(material => [
          material.materialName,
          material.quantity.toString()
        ]);

        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: materialsTableHeaders,
          body: materialsTableBody,
          theme: 'grid',
          headStyles: {
            fillColor: [70, 70, 70],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          margin: { left: 14 }
        });

        // Payment information
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Payment Details']],
          body: [
            ['Payment Method:', customer.paymentMethod],
            ['Total Amount:', `₹${customer.totalAmount.toFixed(2)}`],
          ],
          theme: 'plain',
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 14 }
        });

        // Add signature space
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.text('Authorised Signatory', doc.internal.pageSize.width / 2, pageHeight - 30, { align: 'center' });
        doc.text('Thank you for your business!', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });

        // Save PDF
        doc.save(`GatePass_${customer.PassNumber}_${customer.customerName}.pdf`);
        navigate(-1);
      } catch (error) {
        console.error('Error generating PDF:', error);
        console.log('Customer data:', customer);
      }
    };

    generatePDF();
  }, [customer, navigate]);

  // Add debug output
  console.log('Current customer data:', customer);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Generating PDF...</p>
    </div>
  );
};

export default Pdf;