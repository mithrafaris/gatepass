import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  Button,
} from "@mui/material";
import { FaCar } from "react-icons/fa";

function GatepassTable() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const printRef = useRef();

  const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }));

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch("/api/pass");
        const data = await response.json();
        setInvoiceData(data);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchInvoiceData();
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Gatepass - ${invoiceData?.PassNumber || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; padding: 10px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .table th, 
            .table td { border: 1px solid #333; padding: 5px; }
            .table th { background: #f5f5f5; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!invoiceData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <StyledPaper ref={printRef}>
              <div container spacing={3} sx={{ mb: 4 }}>
                <div item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FaCar size={40} />
                    <Typography variant="h4">{invoiceData.company?.name}</Typography>
                  </Box>
                  <Typography>{invoiceData.company?.address}</Typography>
                  <Typography>{invoiceData.company?.office}</Typography>
                </div>
              </div>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sl no:</TableCell>
                      <TableCell>Material no:</TableCell>
                      <TableCell>Material name:</TableCell>
                      <TableCell>Description:</TableCell>
                      <TableCell align="right">OutTime:</TableCell>
                      <TableCell align="right">InTime:</TableCell>
                      <TableCell align="right">totalAmount:</TableCell>
                      <TableCell align="right">Payment Method:</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceData.materials.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.materialNo}</TableCell>
                        <TableCell>{item.materialName}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.outTime}</TableCell>
                        <TableCell align="right">{item.inTime}</TableCell>
                        <TableCell align="right">{item.totalAmount}</TableCell>
                        <TableCell align="right">{item.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledPaper>
          </Container>
          <Box sx={{ textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handlePrint}>
              Print Invoice
            </Button>
          </Box>
        </main>
      </div>
    </div>
  );
}

export default GatepassTable;
