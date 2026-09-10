/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Fade,
  Grow,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import { verifySchema } from "../../schemas/ValidationSchemas";
import {
  VerifyEmail,
  clearError,
  resendVerification,
} from "../../features/auth/authSlice";
import type { VerifyCredentials } from "../../typescript/type/index";
import { store, type RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hook";

const VerifyPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, verificationEmail } = useAppSelector(
    (state: RootState) => state.user,
  );

  console.log(
  "VERIFY PAGE DIRECT STORE:",
  store.getState().user.verificationEmail
);

console.log(
  "VERIFY PAGE SELECTOR:",
  verificationEmail
);

  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [otpInput, setOtpInput] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);

  const defaultValues: VerifyCredentials = {
    email: verificationEmail || "",
    otp: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VerifyCredentials>({
    resolver: yupResolver(verifySchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const watchedOtp = watch("otp");

  useEffect(() => {
  console.log("verification email", verificationEmail);
  if (isVerified) {
    return;
  }

  if (!verificationEmail) {
    navigate("/register");
    return;
  }

  setValue("email", verificationEmail);
}, [
  verificationEmail,
  isVerified,
  navigate,
  setValue,
]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendTimer > 0) {
      setCanResend(false);
      timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (watchedOtp && watchedOtp.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [watchedOtp]);

  const onSubmit = async (data: VerifyCredentials) => {
  try {
    setLocalError(null);
    setSuccessMessage(null);

    setActiveStep(1);

    toast.loading("Verifying your email...", {
      id: "verify-loading",
    });

    await dispatch(VerifyEmail(data)).unwrap();

    toast.dismiss("verify-loading");

    setIsVerified(true);

    setSuccessMessage(
      "Email verified successfully! Redirecting to login..."
    );

    setActiveStep(2);

    toast.success("Email verified successfully! 🎉");

    navigate("/login");

  } catch (error: any) {
    toast.dismiss("verify-loading");

    setActiveStep(0);

    setLocalError(
      error || "Verification failed. Please try again."
    );

    toast.error(error || "Verification failed");
  }
};

  const handleResendOTP = async () => {
    try {
      if (!verificationEmail) {
        toast.error("No email found for resending OTP");
        return;
      }

      setResendTimer(60);
      setLocalError(null);
      setSuccessMessage(null);

      toast.loading("Sending new OTP...", { id: "resend-loading" });

      
      const result = await dispatch(
        resendVerification(verificationEmail),
      ).unwrap();

      toast.dismiss("resend-loading");
      setSuccessMessage(
        result.message ||
          "New OTP sent to your email. Please check your inbox.",
      );
      toast.success("New OTP sent successfully!");
      setActiveStep(0);
    } catch (error: any) {
      toast.dismiss("resend-loading");
      setLocalError(error || "Failed to resend OTP");
      toast.error(error || "Failed to resend OTP");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    const otpString = newOtp.join("");
    setValue("otp", otpString);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpInput[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const steps = ["Enter OTP", "Verifying", "Verified"];

  const renderOtpInputs = () => (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center", my: 2 }}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <TextField
          key={index}
          id={`otp-${index}`}
          value={otpInput[index] || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            if (value.length <= 1) {
              handleOtpChange(index, value);
            }
          }}
          onKeyDown={(e: any) => handleOtpKeyDown(index, e)}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "24px",
                padding: "8px",
                width: "40px",
              },
            },
          }}
          variant="outlined"
          size="medium"
          disabled={loading || activeStep === 2}
          autoFocus={index === 0}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
              },
            },
          }}
        />
      ))}
    </Box>
  );

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "warning.main", width: 56, height: 56 }}>
            <VerifiedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Verify Your Email
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Please enter the 6-digit verification code sent to your email
            address to complete your registration.
          </Typography>
        </Box>

        <Card
          variant="outlined"
          sx={{ mb: 3, bgcolor: "grey.50", borderRadius: 2 }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {verificationEmail || "Not set"}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          {(error || localError) && (
            <Fade in={!!error || !!localError}>
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                icon={<CancelIcon />}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setLocalError(null);
                      dispatch(clearError());
                    }}
                  >
                    Dismiss
                  </Button>
                }
              >
                {error || localError}
              </Alert>
            </Fade>
          )}

          {successMessage && (
            <Grow in={!!successMessage}>
              <Alert
                severity="success"
                sx={{ mb: 2 }}
                icon={<CheckCircleIcon />}
              >
                {successMessage}
              </Alert>
            </Grow>
          )}

          <input type="hidden" {...register("email")} />
          <input type="hidden" {...register("otp")} />

          {activeStep === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter the 6-digit code sent to your email:
              </Typography>
              {renderOtpInputs()}
              {errors.otp && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", textAlign: "center" }}
                >
                  {errors.otp.message}
                </Typography>
              )}
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Verifying your email...
              </Typography>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="h6" sx={{ mt: 2, color: "success.main" }}>
                Email Verified!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Redirecting to login page...
              </Typography>
            </Box>
          )}

          {activeStep !== 2 && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading || activeStep === 1}
              startIcon={
                activeStep === 1 ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <VerifiedIcon />
                )
              }
            >
              {activeStep === 1 ? "Verifying..." : "Verify Email"}
            </Button>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendOTP}
              disabled={!canResend || loading || activeStep === 2}
              startIcon={<RefreshIcon />}
            >
              {canResend ? "Resend OTP" : `${resendTimer}s`}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/login")}
              disabled={loading}
              startIcon={<LockIcon />}
            >
              Back to Login
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block", textAlign: "center" }}
          >
            {canResend
              ? "Didn't receive the code? Click Resend OTP."
              : "Please wait before resending the code."}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyPage;
