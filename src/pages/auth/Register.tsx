import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import type { SignupCredentials } from "../../typescript/type";
import { store, type RootState } from "../../app/store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../schemas/ValidationSchemas";
import {
  clearError,
  resendVerification,
  signup,
} from "../../features/auth/authSlice";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Avatar, Box, Button, CircularProgress, Container, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, } = useAppSelector(
    (state: RootState) => state.user,
  );

  const defaultValues: SignupCredentials = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupCredentials>({
    resolver: yupResolver(signupSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: SignupCredentials) => {
  try {
    const result = await dispatch(signup(data)).unwrap();

    console.log("SIGNUP RESULT:", result);

    console.log(
      "BEFORE RESEND:",
      store.getState().user.verificationEmail
    );

    await dispatch(
      resendVerification(data.email)
    ).unwrap();

    console.log(
      "BEFORE NAVIGATE:",
      store.getState().user.verificationEmail
    );

    navigate("/verify");

  } catch (error) {
    console.log(error);
  }
};

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join our blog platform and start sharing your ideas
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            label="Full Name"
            placeholder="Enter your full name"
            autoComplete="name"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Email Address"
            placeholder="your@email.com"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Phone Number"
            placeholder="+1234567890"
            autoComplete="tel"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            placeholder="Create a strong password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
          />
          
          <FormControl fullWidth margin="normal" error={!!errors.role} disabled={loading}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              {...register('role')}
              defaultValue="user"
              onChange={(e) => setValue('role', e.target.value as "admin" | "writer" | "user")}
            >
              <MenuItem value="admin">admin</MenuItem>
              <MenuItem value="writer">writer</MenuItem>
              <MenuItem value="viewer">user</MenuItem>
            </Select>
            {errors.role && (
              <FormHelperText>{errors.role.message}</FormHelperText>
            )}
          </FormControl>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Already have an account? <strong>Sign In</strong>
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
