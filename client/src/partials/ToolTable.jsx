import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";  // Import Print Icon
import Button from "@mui/material/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from "react-redux";
import AddMaterial from "./AddMaterial";
import DialogComponent from "./DialogComponent";

const columns = [
  { id: "materialNumber", label: "Sl. No", minWidth: 90 },
  { id: "materialName", label: "Name", minWidth: 120 },
  { id: "category", label: "Category", minWidth: 120 },
  { id: "description", label: "Description", minWidth: 150 },
  { id: "price", label: "Price", minWidth: 100, align: "right" },
  { id: "stock", label: "Stock", minWidth: 100, align: "right" },
  { id: "isAvailable", label: "Is Available", minWidth: 120, align: "center" },
];

export default function ToolTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = useSelector((state) => state.user?.currentUser);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("/user/getMaterial");
        const data = await res.json();
        if (data.success) {
          setRows(
            data.materials.map((material, index) => ({
              ...material,
              materialNumber: index + 1,
              isAvailable: material.stock > 0 ? "Available" : "Unavailable",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, [currentUser]);

  // Function to generate and download PDF
  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Materials Report", 14, 15);

    const tableColumn = columns.map((col) => col.label);
    const tableRows = rows.map((row) => [
      row.materialNumber,
      row.materialName,
      row.category,
      row.description,
      row.price,
      row.stock,
      row.isAvailable,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Materials_Report.pdf");
  };

  return (
    <div>
      <h1 className="my-3 text-4xl font-bold">Materials</h1>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <AddMaterial refreshMaterials={() => {}} />
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handlePrint} startIcon={<PrintIcon />}>
            Print 
          </Button>
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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row._id}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {column.id === "isAvailable" ? (
                        <span style={{ color: row[column.id] === "Available" ? "green" : "red", fontWeight: "bold" }}>
                          {row[column.id]}
                        </span>
                      ) : column.id === "actions" ? (
                        <div>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      ) : (
                        row[column.id]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </Paper>
    </div>
  );
}
