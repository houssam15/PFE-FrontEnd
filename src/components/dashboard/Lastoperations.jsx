import React, { Children, useEffect, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const columns = [
  { field: "recherche", headerName: "Critéria", width: 320 },
  { field: "numberDeleted", headerName: "Total_Deleted", width: 320 },
  { field: "time", headerName: "Time", width: 320 },
];
//hh
const Lastoperations = ({ history }) => {
  history
    .slice()
    .reverse()
    .map((h) => {
      h.id = h.time;
      return h;
    });
  return (
    <>
      <div className="mx-auto border border-spacing-1 border-gray-400 rounded-xl mt-10 p-12">
        <h1 className="m-0 mb-10 ml-10 text-4xl no-underline font-bold">
          Last Operations
        </h1>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            columns={columns}
            scroll={"paper"}
            rows={history ? (history.length !== 0 ? history : []) : []}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Box>
      </div>
    </>
  );
};

export default Lastoperations;
