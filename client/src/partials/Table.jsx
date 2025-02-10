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
  { id: 'customerName', label: 'Customer Name', minWidth: 130 },
  { id: 'customerAddress', label: 'Customer Address', minWidth: 150, align: 'right' },
  { id: 'ReturnDate', label: 'Return Date', minWidth: 130, align: 'right' },
  { id: 'OutDate', label: 'Out Date', minWidth: 130, align: 'right' },
  { id: 'totalAmount', label: 'Total Amount', minWidth: 130, align: 'right', format: (value) => value.toFixed(2) },
  { id: 'paymentMethod', label: 'Payment Method', minWidth: 130, align: 'right' },
  { id: 'material', label: 'Material', minWidth: 150, align: 'right' },
];

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

    fetchMaterials();
  }, []);

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

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    columns.some((column) => {
      const value = row[column.id];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text('Gate Pass List', 14, 10);

    const tableColumn = columns.map(col => col.label);
    const tableRows = filteredRows.map(row =>
      columns.map(col => row[col.id] || '-')
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('GatePass_List.pdf');
  };

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
          <Button variant="contained" color="primary" onClick={handlePrint} startIcon={<PrintIcon />}>
            Print
          </Button>
        </div>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value || '-'}
                        </TableCell>
                      );
                    })}
                    <TableCell align="center">
                      <IconButton onClick={() => handleDelete(row._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No matching data found
                  </TableCell>
                </TableRow>
              )}
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
