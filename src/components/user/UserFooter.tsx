import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  IconButton,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const UserFooter = () => {
  const quickLinks = ["Home", "All Blogs", "Popular", "Latest", "About Us"];

  const categories = [
    "Technology",
    "Programming",
    "Lifestyle",
    "Travel",
    "Business",
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#111827",
        color: "#fff",
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 6,
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: {
              xs: 4,
              md: 6,
            },
          }}
        >
          <Box
            sx={{
              flex: 2,
              minWidth: 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 2,
              }}
            >
              BlogSpace
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#9CA3AF",
                lineHeight: 1.8,
                maxWidth: 380,
              }}
            >
              Discover inspiring stories, useful ideas, technology, lifestyle
              and everything worth reading — all in one place.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                mt: 3,
              }}
            >
              {[
                FacebookIcon,
                TwitterIcon,
                InstagramIcon,
                LinkedInIcon,
                EmailIcon,
              ].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: "#9CA3AF",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "#1F2937",
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Quick Links
            </Typography>

            <Box>
              {quickLinks.map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    display: "block",
                    color: "#9CA3AF",
                    mb: 1.2,
                    fontSize: "14px",
                    transition: "0.2s",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Categories
            </Typography>

            <Box>
              {categories.map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    display: "block",
                    color: "#9CA3AF",
                    mb: 1.2,
                    fontSize: "14px",
                    transition: "0.2s",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Get in Touch
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#9CA3AF",
                lineHeight: 1.8,
                mb: 1,
              }}
            >
              Have a question, suggestion or feedback?
            </Typography>

            <Link
              href="mailto:hello@blogspace.com"
              underline="none"
              sx={{
                color: "#D1D5DB",
                fontSize: "14px",
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              hello@blogspace.com
            </Link>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#374151" }} />

        <Box
          sx={{
            py: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#9CA3AF",
              fontSize: "13px",
            }}
          >
            © {new Date().getFullYear()} BlogSpace. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="#"
              underline="none"
              sx={{
                color: "#9CA3AF",
                fontSize: "13px",
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              underline="none"
              sx={{
                color: "#9CA3AF",
                fontSize: "13px",
                "&:hover": {
                  color: "#fff",
                },
              }}
            >
              Terms & Conditions
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UserFooter;
