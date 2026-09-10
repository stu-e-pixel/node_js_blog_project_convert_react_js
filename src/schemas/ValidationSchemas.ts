import * as yup from 'yup';

export const signupSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string()
    .oneOf(['admin', 'writer', 'user'], 'Invalid role')
    .required('Role is required'),
});

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const verifySchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  otp: yup.string()
    .matches(/^\d{6}$/, 'OTP must be 6 digits')
    .required('OTP is required'),
});

export const resetPasswordLinkSchema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export const resetPasswordSchema = yup.object({
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  comformpassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

