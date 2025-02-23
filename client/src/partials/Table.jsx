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
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';

const columns = [
  { id: 'PassNumber', label: 'Sl.No', minWidth: 90 },
  { id: 'customerName', label: 'Customer', minWidth: 150 },
  { id: 'OutDate', label: 'Out Date', minWidth: 120, align: 'center' },
  { id: 'ReturnDate', label: 'Return Date', minWidth: 120, align: 'center' },
  { id: 'totalAmount', label: 'Total Amount', minWidth: 120, align: 'right' },
  { id: 'materials', label: 'Materials', minWidth: 200 },
];

export default function GatePassList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = rows.filter(row => {
      const searchLower = searchTerm.toLowerCase();
      const passNumber = String(row.PassNumber || '').toLowerCase();
      const customerName = (row.customerName || '').toLowerCase();

      return passNumber.includes(searchLower) || customerName.includes(searchLower);
    });
    setFilteredRows(filtered);
    setPage(0);
  }, [searchTerm, rows]);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/user/getpass');
      const data = await res.json();
      if (data.success && Array.isArray(data.pass)) {
        setRows(data.pass);
        setFilteredRows(data.pass);
      } else {
        setRows([]);
        setFilteredRows([]);
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
        const updatedRows = rows.filter(row => row._id !== id);
        setRows(updatedRows);
        setFilteredRows(updatedRows);
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
    <Box sx={{ maxWidth: '100%', padding: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Gate Pass List
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
        {/* Search Bar */}
        <Box sx={{ display: 'block', alignItems: 'center', mb: 2 }}>
          <TextField
          
            
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} />,
            }}
          />
        </Box>

        {/* Table Container */}
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'} style={{ minWidth: column.minWidth }}>
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
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.id === 'materials' ? (
                        (row.materials || []).map((mat, index) => (
                          <Typography key={index} variant="body2">
                            {mat.materialName} (Qty: {mat.quantity})
                          </Typography>
                        ))
                      ) : (
                        row[column.id] || '-'
                      )}
                    </TableCell>
                  ))}
                  {/* Actions */}
                  <TableCell align="center">
                    <IconButton onClick={() => handleDelete(row._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      color="primary"
                      onClick={() => handleViewDetails(row)}
                      startIcon={<InfoIcon />}
                      sx={{ ml: 1 }}
                    > 
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
        />
      </Paper>
    </Box>
  );
}
