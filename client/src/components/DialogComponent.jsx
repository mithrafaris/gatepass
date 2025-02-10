// DialogComponent.js
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function DialogComponent({ open, mode, data, onClose, onSubmit }) {
  const [formData, setFormData] = useState({});

  // Update form data when the data prop changes.
  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (mode === 'delete') {
      onSubmit(); // No arguments needed for delete
    } else if (mode === 'edit') {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'delete' ? 'Confirm Delete' : 'Edit Material'}
      </DialogTitle>
      <DialogContent>
        {mode === 'delete' ? (
          <p>Are you sure you want to delete this material?</p>
        ) : (
          <>
            <TextField
              autoFocus
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color={mode === 'delete' ? 'secondary' : 'primary'}
        >
          {mode === 'delete' ? 'Delete' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
