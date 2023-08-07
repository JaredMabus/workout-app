import { Button } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const OutlinedHoverContrastBtn = styled(Button)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.7),
  border: `1px solid transparent`,
  transition: "all 200ms ease-in-out",
  ":hover": {
    color: alpha(theme.palette.text.primary, 1),
    border: `1px solid ${alpha(theme.palette.primary.contrastText, 0.8)}`,
  },
}));

export const OutlinedContrastBtn = styled(Button)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 1),
  border: `1px solid ${alpha(theme.palette.text.primary, 1)}`,
  transition: "all 250ms ease-in-out",
  ":hover": {
    color: alpha(theme.palette.text.primary, 1),
    backgroundColor: alpha(theme.palette.border.main, 0.5),
    border: `1px solid ${alpha(theme.palette.text.primary, 1)}`,
  },
}));

export const ContrastBtn = styled(Button)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 1),
  transition: "all 250ms ease-in-out",
  ":hover": {
    color: alpha(theme.palette.text.primary, 1),
    backgroundColor: alpha(theme.palette.border.main, 0.5),
  },
}));
