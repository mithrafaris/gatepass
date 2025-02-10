import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField, MenuItem } from '@mui/material';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function AddMaterial() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialNumber: '',
    materialName: '',
    price: '',
    stock: '',
    description: '',
    category: 'select',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/user/material', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      toast.success('Material added successfully!');

      // Reset form data after successful submission
      setFormData({
        materialNumber: '',
        materialName: '',
        price: '',
        stock: '',
        description: '',
        category: 'select',
      });
      handleClose();
    } catch (error) {
      toast.error('Failed to add material. Please try again.');
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Button variant="outlined" color="info" onClick={handleOpen}>
        Add
      </Button>
      <Modal
        aria-labelledby="add-material-title"
        aria-describedby="add-material-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box component="form" onSubmit={handleSubmit} sx={style}>
            <Typography id="add-material-title" variant="h6" component="h2" gutterBottom>
              Add Material
            </Typography>

            <TextField
              required
              label="Material Number"
              name="materialNumber"
              type="number"
              value={formData.materialNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              required
              label="Material Name"
              name="materialName"
              value={formData.materialName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              required
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              required
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              required
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              select
              required
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {['select', 'Accessories', 'Tools', 'Parts'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
