import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  TextField,
  MenuItem,
  useTheme
} from '@mui/material';

const AddMaterial = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialNumber: '',
    materialName: '',
    price: '',
    stock: '',
    description: '',
    category: 'select',
  });

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
    border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
    boxShadow: theme.shadows[24],
    p: 4,
    borderRadius: 2,
  };

  const violetButtonStyle = {
    backgroundColor: '#7c4dff',
    '&:hover': {
      backgroundColor: '#651fff',
    },
    color: '#ffffff',
  };

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
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      <ToastContainer position="top-right" autoClose={3000} theme={theme.palette.mode} />
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={violetButtonStyle}
      >
        Add Material
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
          <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
            <Typography 
              id="add-material-title" 
              variant="h6" 
              component="h2" 
              gutterBottom
              color="text.primary"
            >
              Add Material
            </Typography>

            {[
              { name: 'materialNumber', label: 'Material Number', type: 'number' },
              { name: 'materialName', label: 'Material Name', type: 'text' },
              { name: 'price', label: 'Price', type: 'number' },
              { name: 'stock', label: 'Stock', type: 'number' },
            ].map((field) => (
              <TextField
                key={field.name}
                required
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0',
                    },
                  },
                }}
              />
            ))}

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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'dark' ? '#404040' : '#e0e0e0',
                  },
                },
              }}
            >
              {['select', 'Accessories', 'Tools', 'Parts'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Button 
              type="submit" 
              variant="contained" 
              sx={{
                ...violetButtonStyle,
                mt: 2,
                width: '100%'
              }}
            >
              Submit
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default AddMaterial;