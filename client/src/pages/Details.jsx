import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, TextField, Paper, Typography, Box } from '@mui/material';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(location.state?.customer || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (customer.PassNumber) {
      fetch(`/user/gatepass/${customer.PassNumber}`)
        .then((res) => res.json())
        .then((data) => setCustomer(data.pass))
        .catch((err) => console.error('Error fetching details:', err));
    }
  }, [customer.PassNumber]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleMaterialChange = (index, field, value) => {
    const updatedMaterials = [...(customer.materials || [])];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setCustomer({ ...customer, materials: updatedMaterials });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/user/editPass/${customer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });
      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomer(updatedCustomer.updatedGatePass);
        setIsEditing(false);
      } else {
        console.error('Failed to update gate pass');
      }
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="my-3 text-4xl font-bold">Customer Details</h1>
            <Paper sx={{ padding: 2, maxWidth: 600, margin: 'auto' }}>
              <TextField fullWidth margin="normal" label="Sl.No" name="PassNumber" value={customer.PassNumber || ''} disabled />
              <TextField fullWidth margin="normal" label="Customer Name" name="customerName" value={customer.customerName || ''} onChange={handleChange} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Address" name="customerAddress" value={customer.customerAddress || ''} onChange={handleChange} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Out Date" name="OutDate" value={customer.OutDate || ''} onChange={handleChange} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Return Date" name="ReturnDate" value={customer.ReturnDate || ''} onChange={handleChange} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Total Amount" name="totalAmount" value={customer.totalAmount || ''} onChange={handleChange} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Payment Method" name="paymentMethod" value={customer.paymentMethod || ''} onChange={handleChange} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Remarks" name="Remarks" value={customer.Remarks || ''} onChange={handleChange} disabled={!isEditing} />

              {/* Materials Section */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Materials</Typography>
                {customer.materials && customer.materials.length > 0 ? (
                  customer.materials.map((material, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Material Name"
                        value={material.materialName || ''}
                        onChange={(e) => handleMaterialChange(index, 'materialName', e.target.value)}
                        disabled={!isEditing}
                      />
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={material.quantity || ''}
                        onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No materials found.
                  </Typography>
                )}
              </Box>

              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button variant="contained" color="success" sx={{ mt: 2, ml: 2 }} onClick={handleSave}>
                  Save
                </Button>
              )}
              <Button variant="contained" color="error" sx={{ mt: 2, ml: 2 }} onClick={() => navigate('/pdf', { state: { customer } })}>
                Generate PDF
              </Button>
            </Paper>
          </div>
        </main>
      </div>
    </div>
  );
}
