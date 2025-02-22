import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useLocation, useNavigate } from 'react-router-dom';

const Pdf = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = location.state?.customer;
  const [status, setStatus] = useState('generating');

  useEffect(() => {
    if (!customer) {
      console.error('No customer data found:', customer);
      navigate(-1);
      return;
    }

    const generatePDF = async () => {
      try {
        const doc = new jsPDF();
        
        // Move icon to top
        const carIcon = 'https://img.icons8.com/?size=100&id=VH1jBQbwHr7s&format=png&color=000000';
        doc.addImage(carIcon, 'JPEG', 5, 10, 45, 25);
        
        // Company name
        doc.setFontSize(30);
        doc.setFont('helvetica', 'bold');
        doc.text('Bridgeway Motors LLP', doc.internal.pageSize.width / 2, 25, { align: 'center' });
        
        // Contact information
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(' Dealer for Mercedes-Benz Passenger Car,', doc.internal.pageSize.width / 2, 35, { align: 'center' });
        doc.text('Farook College PO, Office: Calicut NH Bypass Road, Azhinjilam, Calicut-673632', doc.internal.pageSize.width / 2, 40, { align: 'center' });
        
        // Gate pass title
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('MATERIAL GATE PASS', doc.internal.pageSize.width / 2, 50, { align: 'center' });
       
        // Decorative line
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.5);
        doc.line(14, 55, doc.internal.pageSize.width - 14, 55);
        
        // Pass number and date
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Pass Number: ${customer.PassNumber}`, 14, 65);
        doc.text(`Date: ${customer.OutDate}`, doc.internal.pageSize.width - 14, 65, { align: 'right' });
        
        // Customer information table
        doc.autoTable({
          startY: 75,
          head: [['Customer Information']],
          body: [
            [`Name: ${customer.customerName}`],
            [`Address: ${customer.customerAddress}`],
            [`Return Date: ${customer.ReturnDate}`],
          ],
          theme: 'striped',
          headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
          bodyStyles: { fillColor: [240, 244, 248], textColor: [44, 62, 80] },
          margin: { left: 14, right: 14 }
        });
        
        // Materials table
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Material Name', 'Quantity']],
          body: customer.materials.map(material => [material.materialName, material.quantity.toString()]),
          theme: 'grid',
          headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
          bodyStyles: { textColor: [44, 62, 80] },
          alternateRowStyles: { fillColor: [240, 244, 248] },
          margin: { left: 14, right: 14 }
        });
        
        // Payment details
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Payment Details']],
          body: [
            [`Payment Method: ${customer.paymentMethod}`],
            [`Total Amount: ${customer.totalAmount.toFixed(2)}`],
          ],
          theme: 'plain',
          headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
          bodyStyles: { textColor: [44, 62, 80] },
          margin: { left: 14, right: 14 }
        });
        
        // RemarksSection
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Remarks']],
          body: [[customer.Remarks|| 'No remarks']],
          theme: 'plain',
          headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
          bodyStyles: { textColor: [44, 62, 80] },
          margin: { left: 14, right: 14 }
        });
        
        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Authorised Signatory', doc.internal.pageSize.width / 2, pageHeight - 40, { align: 'center' });
        doc.line(doc.internal.pageSize.width / 2 - 30, pageHeight - 35, doc.internal.pageSize.width / 2 + 30, pageHeight - 35);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Thank you for choosing Bridgeway Motors LLP', doc.internal.pageSize.width / 2, pageHeight - 25, { align: 'center' });
        
        // Save PDF
        doc.save(`GatePass_${customer.PassNumber}_${customer.customerName}.pdf`);
        setStatus('complete');
        setTimeout(() => navigate(-1), 1500);
      } catch (error) {
        console.error('Error generating PDF:', error);
        setStatus('error');
      }
    };

    generatePDF();
  }, [customer, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-black rounded-lg shadow-lg text-center text-zinc-300">
        {status === 'generating' && <p>Generating PDF...</p>}
        {status === 'complete' && <p>PDF Generated Successfully!</p>}
        {status === 'error' && <p>Error Generating PDF</p>}
      </div>
    </div>
  );
};

export default Pdf;
