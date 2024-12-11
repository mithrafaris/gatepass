import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const columns = [
  { field: "_id", headerName: "ID", width:100 },
  { field: "username", headerName: "Username", width: 250 },
  { field: "email", headerName: "Email", width: 200 },
];

export default function Tables() {
  const [rows, setRows] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/user/getuser");
        const data = await response.json();
        const formattedData = data.map((user, index) => ({
          id: index + 1, // Add a sequential ID
          ...user,
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
