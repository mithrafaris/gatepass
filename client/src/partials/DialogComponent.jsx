import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function DialogComponent({ open, onClose, mode, data, onSubmit }) {
  const [formData, setFormData] = useState(data || {});

useEffect(() => {
  
  
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (mode === 'edit') {
      onSubmit(formData);
    } else if (mode === 'delete') {
      onSubmit(formData.id);  
    }
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'edit' ? 'Edit Material' : 'Confirm Delete'}</DialogTitle>
      <DialogContent>
        {mode === 'edit' ? (
          <div>
          <TextField
          margin="dense"
          label="material Number"
          name="material Name"
          value={formData. materialNumber || ''}
          onChange={handleChange}
          fullWidth
        />

            <TextField
              margin="dense"
              label="material Name"
              name="materialName"
              value={formData. materialNumber || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Category"
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock || ''}
              onChange={handleChange}
              fullWidth
            />
          </div>
        ) : (
          <p>Are you sure you want to delete this item?</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {mode === 'edit' ? 'Save' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
