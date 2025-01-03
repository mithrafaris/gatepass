import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function DialogComponent({ open, onClose, mode, data, onSubmit }) {
  const [formData, setFormData] = useState({});

  // Sync data to formData when data changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (mode === 'edit') {
      if (formData.materialName && formData.materialNumber) {
        onSubmit(formData);
      } else {
        alert('Please fill all required fields.');
        return;
      }
    } else if (mode === 'delete') {
      if (formData.id) {
        onSubmit(formData.id);
      } else {
        alert('No material selected to delete.');
        return;
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'edit' ? 'Edit Material' : 'Confirm Delete'}</DialogTitle>
      <DialogContent>
        {mode === 'edit' ? (
          <>
            <TextField
              margin="dense"
              label="Material Number"
              name="materialNumber"
              value={formData.materialNumber || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Material Name"
              name="materialName"
              value={formData.materialName || ''}
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
          </>
        ) : (
          <p>Are you sure you want to delete this material?</p>
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
