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
        const carIcon = 'https://img.icons8.com/ios/452/car--v1.png';
        `)}`;
         doc.addImage(carIcon, 'JPEG', 20, 20, 30, 20);
         doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Bridgeway Motors LLP', doc.internal.pageSize.width / 2, 20, { align: 'center' });
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('MATERIAL GATE PASS INVOICE', doc.internal.pageSize.width / 2, 35, { align: 'center' });
        
        // Add decorative line
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.5);
        doc.line(14, 40, doc.internal.pageSize.width - 14, 40);
        
        // Add pass number and date with improved styling
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Pass Number: ${customer.PassNumber}`, 14, 50);
        doc.text(`Date: ${customer.OutDate}`, doc.internal.pageSize.width - 14, 50, { align: 'right' });
        
        // Customer information table with improved styling
        doc.autoTable({
          startY: 60,
          head: [['Customer Information']],
          body: [
            [`Name: ${customer.customerName}`],
            [`Address: ${customer.customerAddress}`],
            [`Return Date: ${customer.ReturnDate}`],
          ],
          theme: 'striped',
          headStyles: { 
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left'
          },
          bodyStyles: {
            fillColor: [240, 244, 248],
            textColor: [44, 62, 80]
          },
          margin: { left: 14, right: 14 }
        });
        
        // Materials table with improved styling
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Material Name', 'Quantity']],
          body: customer.materials.map(material => [
            material.materialName,
            material.quantity.toString()
          ]),
          theme: 'grid',
          headStyles: {
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          bodyStyles: {
            textColor: [44, 62, 80]
          },
          alternateRowStyles: {
            fillColor: [240, 244, 248]
          },
          margin: { left: 14, right: 14 }
        });
        
        // Payment details with improved styling
        doc.autoTable({
          startY: doc.previousAutoTable.finalY + 10,
          head: [['Payment Details']],
          body: [
            [`Payment Method: ${customer.paymentMethod}`],
            [`Total Amount: $${customer.totalAmount.toFixed(2)}`],
          ],
          theme: 'plain',
          headStyles: {
            fillColor: [52, 73, 94],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          bodyStyles: {
            textColor: [44, 62, 80]
          },
          margin: { left: 14, right: 14 }
        });
        
        // Footer with improved styling
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Authorised Signatory', doc.internal.pageSize.width / 2, pageHeight - 40, { align: 'center' });
        doc.line(doc.internal.pageSize.width / 2 - 30, pageHeight - 35, doc.internal.pageSize.width / 2 + 30, pageHeight - 35);
        
        // Company footer
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Thank you for choosing Bridgeway Motors LLP', doc.internal.pageSize.width / 2, pageHeight - 25, { align: 'center' });
        doc.text('For any queries,please contact: Dealer for Mercedes-Benz Passenger Car, Farook College PO,Office:Calicut NH Bypass Road,Azhinjilam,Calicut-673632 ', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });
        
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

  const renderLoadingState = () => (
    <>
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Generating Your PDF</h2>
      <p className="text-gray-600">Please wait while we prepare your document...</p>
    </>
  );

  const renderSuccessState = () => (
    <>
      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">PDF Generated Successfully!</h2>
      <p className="text-gray-600">Your document has been downloaded.</p>
    </>
  );

  const renderErrorState = () => (
    <>
      <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Generating PDF</h2>
      <p className="text-gray-600">Please try again or contact support.</p>
      <button 
        onClick={() => navigate(-1)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go Back
      </button>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        {status === 'generating' && renderLoadingState()}
        {status === 'complete' && renderSuccessState()}
        {status === 'error' && renderErrorState()}
      </div>
    </div>
  );
};

export default Pdf;