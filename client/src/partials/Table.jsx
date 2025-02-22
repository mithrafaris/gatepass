// GatePassList.jsx
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
  IconButton,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const columns = [
  { id: 'PassNumber', label: 'Sl.No', minWidth: 90 },
  { id: 'customerName', label: 'Customer', minWidth: 100 },
  { id: 'OutDate', label: 'Out Date', minWidth: 100, align: 'right' },
  { id: 'ReturnDate', label: 'Return Date', minWidth: 100, align: 'right' },
  { id: 'totalAmount', label: 'Total Amount', minWidth: 100, align: 'right' },
  { id: 'materials', label: 'Materials & Qty', minWidth: 150 },
];

export default function GatePassList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/user/getpass');
      const data = await res.json();
      if (data.success && Array.isArray(data.pass)) {
        setRows(data.pass);
        
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

  const handleViewDetails = (row) => {
    navigate('/details', { state: { customer: row }, replace: false });
  };

  return (
    <div>
      <h1 className="my-3 text-4xl font-bold">Gate Pass List</h1>
      <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
        <TableContainer>
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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row._id}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === 'materials' 
                        ? (row.materials || []).map(mat => `${mat.materialName} (Qty: ${mat.quantity})`).join(', ')
                        : row[column.id] || '-'}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <IconButton onClick={() => handleDelete(row._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <Button color="primary" onClick={() => handleViewDetails(row)} startIcon={<InfoIcon />}></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
        />
      </Paper>
    </div>
  );
}
