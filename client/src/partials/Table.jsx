import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';

const columns = [
  { id: 'PassNumber', label: 'Sl.No', minWidth: 90 },
  { id: 'customerName', label: 'Customer Name', minWidth: 100 },
  { id: 'customerAddress', label: 'Customer Address', minWidth: 150, align: 'right' },
  { id: 'OutDate', label: 'Out Date', minWidth: 100, align: 'right' },
  { id: 'ReturnDate', label: 'Return Date', minWidth: 100, align: 'right' },
  { id: 'totalAmount', label: 'Total Amount', minWidth: 100, align: 'right', format: (value) => value.toFixed(2) },
  { id: 'paymentMethod', label: 'Payment Method', minWidth: 100, align: 'right' },
  { id: 'materials', label: 'Materials & Qty', minWidth: 200, align: 'right' },
];

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/user/getpass');
      const data = await res.json();
      if (data.success && Array.isArray(data.pass)) {
        setRows(data.pass);
        toast.success('Data fetched successfully!', { position: 'top-right' });
      } else {
        setRows([]);
        toast.warn('No data found.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error fetching gate passes:', error);
      toast.error('Failed to fetch data!', { position: 'top-right' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/user/deletepass/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRows(rows.filter(row => row._id !== id));
        toast.success('Entry deleted successfully!', { position: 'top-right' });
      } else {
        toast.error('Failed to delete entry.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Error deleting entry!', { position: 'top-right' });
    }
  };

  const generatePDF = (customer) => {
    try {
      // Debug log to check customer data
      console.log('Generating PDF for customer:', customer);

      if (!customer || !customer.materials) {
        toast.error('Invalid customer data!');
        return;
      }

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
      doc.text(`Pass Number: ${customer.PassNumber || 'N/A'}`, 14, 40);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, 40, { align: 'right' });
      doc.autoTable({
        startY: 50,
        head: [['Customer Information']],
        body: [
          ['Name:', customer.customerName],
          ['Address:', customer.customerAddress],
          ['Out Date:', customer.OutDate ],
          ['Return Date:', customer.ReturnDate],
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

      // Materials table with validation
      const materialsTableHeaders = [['Material Name', 'Quantity']];
      const materialsTableBody = Array.isArray(customer.materials) 
        ? customer.materials.map(material => [
            material.materialName || 'N/A',
            (material.quantity || 'N/A').toString()
          ])
        : [['No materials', 'N/A']];

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
          ['Payment Method:', customer.paymentMethod || 'N/A'],
          ['Total Amount:', customer.totalAmount ? `₹${customer.totalAmount.toFixed(2)}` : 'N/A'],
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
      const fileName = `GatePass_${customer.PassNumber || 'NA'}_${customer.customerName || 'Unknown'}.pdf`;
      doc.save(fileName);
      toast.success('PDF generated successfully!', { position: 'top-right' });

    } catch (error) {
      console.error('Error generating PDF:', error);
      console.log('Customer data:', customer);
      toast.error('Failed to generate PDF!', { position: 'top-right' });
    }
  };

  const handlePrintInvoice = (customer) => {
    if (!customer) {
      toast.warn('No customer selected for invoice.', { position: 'top-right' });
      return;
    }
    console.log('Print button clicked with customer data:', customer);
    generatePDF(customer);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div>
      <h1 className="my-3 text-4xl font-bold">Gate Pass List</h1>
      <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
        <div className="flex justify-between items-center pb-4">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 250 }}
          />
        </div>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'materials' ? (
                          <ul>
                            {row.materials.map((mat, index) => (
                              <li key={index}>
                                {mat.materialName} (Qty: {mat.quantity})
                              </li>
                            ))}
                          </ul>
                        ) : column.format && typeof row[column.id] === 'number' ? (
                          column.format(row[column.id])
                        ) : (
                          row[column.id] || '-'
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <IconButton onClick={() => handleDelete(row._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        color="primary"
                        onClick={() => handlePrintInvoice(row)}
                        startIcon={<PrintIcon />}
                      >
                        Print
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}