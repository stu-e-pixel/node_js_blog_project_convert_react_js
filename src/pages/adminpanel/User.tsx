
import { useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../app/hook";
import type { RootState } from "../../app/store";
import { getAllUsersThunk } from "../../features/auth/authSlice";

const User = () => {
  const dispatch = useAppDispatch();

  const { users, loading } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography>
        All Users
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
                  <strong>Email Status</strong>
                </TableCell>

                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>{user.phone}</TableCell>

                    <TableCell>
                      {user.isVerified
                        ? "Verified"
                        : "Not Verified"}
                    </TableCell>

                    <TableCell>
                      {user.isActive ? "Active" : "Inactive"}
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

export default User;

