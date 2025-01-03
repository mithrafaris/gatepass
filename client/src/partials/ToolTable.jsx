import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import AddMaterial from './AddMaterial';
import DialogComponent from './DialogComponent';

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

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch('/user/getMaterial');
        const data = await res.json();
        if (data.success) {
          const updatedMaterials = data.materials.map((material) => ({
            ...material,
            isAvailable: material.stock > 0, 
          }));
          setRows(updatedMaterials);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchMaterials();
  }, [currentUser]);

  const handleOpenDialog = (mode, row = null) => {
    setDialogMode(mode);
    setCurrentRow(row);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentRow(null);
  };

  const handleEditSubmit = async (updatedRow) => {
    try {
      const res = await fetch(`/user/editMaterial/${updatedRow._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRow),
      });
      const data = await res.json();
      console.log('Edit Response:', data); // Debugging
      if (data.success) {
        setRows((prevRows) =>
          prevRows.map((row) => (row._id === updatedRow._id ? updatedRow : row))
        );
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };
  
  const handleDeleteSubmit = async (rowId) => {
    try {
      const res = await fetch(`/user/deleteMaterial/${rowId}`,
         { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRows((prevRows) => prevRows.filter((row) => row._id !== rowId));
        handleCloseDialog();
      } else {
        console.error('Delete failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };
 
  const handleDialogSubmit = (updatedRow) => {
    const actions = {
      edit: () => handleEditSubmit(updatedRow),
      delete: () => handleDeleteSubmit(updatedRow._id),
    };
  
    actions[dialogMode]?.();
  };
  
  

  const filteredRows = rows.filter((row) =>
    ['materialNumber', 'materialName', 'category'].some((key) =>
      row[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <AddMaterial />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="material table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
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
                          <div>
                            <IconButton onClick={() => handleOpenDialog('edit', row)} color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleOpenDialog('delete', row)} color="secondary">
                              <DeleteIcon />
                            </IconButton>
                          </div>
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
      <DialogComponent
        open={dialogOpen}
        mode={dialogMode}
        data={currentRow}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
      />
    </Paper>
  );
}
