
import { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import type { RootState } from "../../app/store";

import {
  approveWriterThunk,
  getPendingWritersThunk,
} from "../../features/auth/authSlice";

const Writer = () => {
  const dispatch = useAppDispatch();

  const { secretKey, loading } = useAppSelector(
    (state: RootState) => state.user
  );

  const writers = useAppSelector(
    (state: RootState) => state.user.pendingWriters
  );

  useEffect(() => {
    dispatch(getPendingWritersThunk());
  }, [dispatch]);

  const handleApprove = async (userId: string) => {
    if (!secretKey) {
      return;
    }

    await dispatch(
      approveWriterThunk({
        userId,
        secretKey,
      })
    ).unwrap();
    dispatch(getPendingWritersThunk());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>
        Writer Approval
      </Typography>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>

                <TableCell>
                  <strong>Email</strong>
                </TableCell>

                <TableCell>
                  <strong>Phone</strong>
                </TableCell>

                <TableCell>
                  <strong>Email Verified</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && writers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : writers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No pending writers found
                  </TableCell>
                </TableRow>
              ) : (
                writers.map((writer) => (
                  <TableRow key={writer._id}>
                    <TableCell>{writer.name}</TableCell>

                    <TableCell>{writer.email}</TableCell>

                    <TableCell>{writer.phone}</TableCell>

                    <TableCell>
                      {writer.isVerified ? "Verified" : "Not Verified"}
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        disabled={
                          loading ||
                          !writer.isVerified ||
                          !secretKey
                        }
                        onClick={() => handleApprove(writer._id)}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Writer;

