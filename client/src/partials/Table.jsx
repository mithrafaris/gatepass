import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  IconButton,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

const columns = [
  { id: 'PassNumber', label: 'Sl.No', minWidth: 90 },
  { id: 'customerName', label: 'Customer', minWidth: 100 },
  { id: 'customerAddress', label: 'Address', minWidth: 150, align: 'right' },
  { id: 'OutDate', label: 'Out Date', minWidth: 100, align: 'right' },
  { id: 'ReturnDate', label: 'Return Date', minWidth: 100, align: 'right' },
  { id: 'totalAmount', label: 'Amount', minWidth: 100, align: 'right', format: (value) => value.toFixed(2) },
  { id: 'paymentMethod', label: 'Payment Method', minWidth: 100, align: 'right' },
  { id: 'materials', label: 'Materials & Qty', minWidth: 200, align: 'right' },
];

export default function GatePassTable() {
  const navigate = useNavigate();
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

  const handleViewPdf = (customer) => {
    navigate('/pdf', { state: { customer }, replace: false });
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
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 250, marginBottom: 10 }}
        />

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
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
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row._id}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'materials' ? (
                        <ul>
                          {row.materials.map((mat, index) => (
                            <li key={index}>{mat.materialName} (Qty: {mat.quantity})</li>
                          ))}
                        </ul>
                      ) : (
                        row[column.id] || '-'
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <IconButton onClick={() => handleDelete(row._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <Button color="primary" onClick={() => handleViewPdf(row)} startIcon={<PrintIcon />}>
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
