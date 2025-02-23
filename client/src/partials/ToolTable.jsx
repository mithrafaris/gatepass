import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  IconButton, TextField, Button, Snackbar, Alert, Stack, Typography
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Print as PrintIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import AddMaterial from './AddMaterial';
import DialogComponent from './DialogComponent';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const columns = [
  { id: 'materialNumber', label: 'Sl. No', minWidth: 90 },
  { id: 'materialName', label: 'Name', minWidth: 120 },
  { id: 'category', label: 'Category', minWidth: 120 },
  { id: 'description', label: 'Description', minWidth: 150 },
  { id: 'price', label: 'Price', minWidth: 100, align: 'right' },
  { id: 'stock', label: 'Stock', minWidth: 100, align: 'right' },
  { id: 'isAvailable', label: 'Is Available', minWidth: 120, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 150, align: 'center' },
];

export default function ToolTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [currentRow, setCurrentRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const currentUser = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch('/user/getMaterial');
        const data = await res.json();
        if (data.success) {
          setRows(data.materials.map(material => ({
            ...material, isAvailable: material.stock > 0
          })));
        } else {
          showSnackbar('Failed to fetch materials', 'error');
        }
      } catch (error) {
        showSnackbar('Error fetching materials', 'error');
      }
    };

    fetchMaterials();
  }, [currentUser]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Materials Report", 14, 15);
    doc.autoTable({
      head: [columns.map(col => col.label)],
      body: rows.map(row => [
        row.materialNumber, row.materialName, row.category, row.description, row.price, row.stock, 
        row.isAvailable ? 'Available' : 'Unavailable'
      ]),
      startY: 20,
    });
    doc.save("Materials_Report.pdf");
  };

  const filteredRows = rows.filter((row) =>
    ['materialNumber', 'materialName', 'category'].some((key) =>
      row[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="px-4 md:px-10 py-4">
      <Typography variant="h4" component="h1" className="my-3 font-bold text-center">
        Materials
      </Typography>

      <Paper sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" className="mb-4">
          <AddMaterial refreshMaterials={() => {}} />
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 250 }}
          />
          <Button onClick={handlePrint} startIcon={<PrintIcon />} >
            Print
          </Button>
        </Stack>

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row._id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === 'isAvailable' ? (
                          <span style={{ color: value ? 'green' : 'red', fontWeight: 'bold' }}>
                            {value ? 'Available' : 'Unavailable'}
                          </span>
                        ) : column.id === 'actions' ? (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton onClick={() => {}} color="primary" sx={{ fontSize: { xs: 20, md: 24 } }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => {}} color="error" sx={{ fontSize: { xs: 20, md: 24 } }}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </Paper>

      <DialogComponent open={dialogOpen} mode={dialogMode} data={currentRow} onClose={() => {}} onSubmit={() => {}} />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
