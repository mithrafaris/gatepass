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
import AddMaterial from './AddMaterial'; // Component to handle adding materials
import DialogComponent from './DialogComponent'; // Component for dialog handling

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
  console.log('Current User:', currentUser);
  const fetchMaterials = async () => {
    try {
      const res = await fetch('/user/getMaterial');
      const data = await res.json();
      if (data.success) {
        const updatedMaterials = data.materials.map((material) => ({
          ...material,
          isAvailable: material.stock < 1, 
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

  const handleDialogSubmit = (updatedRow) => {
   
  };

  const handleEditSubmit = (updatedRow) => {
   
  };

 
  const filteredRows = rows.filter((row) =>
    ['materialNumber', 'materialName', 'category'].some((key) => {
      const value = row[key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
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
        <Table aria-label="material table">
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
              .map((row, index) => (
                <TableRow hover role="checkbox" key={row.materialNumber}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
  {column.id === 'isAvailable' ? (
    <span
      style={{
        color: value ? 'red' : 'green',
        fontWeight: 'bold',
      }}
    >
      {value ? 'Unavailable' : 'Available'}
    </span>
  ) : column.id === 'actions' ? (
    <div>
      <IconButton
        onClick={() => handleOpenDialog('edit', row)}
        color="primary"
        aria-label="edit"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={() => handleOpenDialog('delete', row)}
        color="secondary"
        aria-label="delete"
      >
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
        rowsPerPageOptions={[1, 2, 3]}
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
        row={currentRow}
        onClose={handleCloseDialog}
        onSubmit={handleDialogSubmit}
      />
    </Paper>
  );
}
