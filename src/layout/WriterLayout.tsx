import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import WriterNavbar from "../components/writer/WriterNavbar";
import WriterSidebar from "../components/writer/WriterSidebar";

const WriteLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      <WriterNavbar />
      <Box
        sx={{
          display: "flex",
          minHeight: "calc(100vh - 70px)",
        }}
      >

        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            borderRight: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <WriterSidebar />
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default WriteLayout;