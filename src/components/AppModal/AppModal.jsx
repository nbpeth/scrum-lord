import { Box, Modal, Stack } from "@mui/material";
import { modalCardSx } from "./AppModal.styles";

export const AppModal = ({ open, onClose, children, sx }) => (
  <Modal
    open={open}
    onClose={(event, reason) => {
      if (reason !== "backdropClick") {
        onClose();
      }
    }}
  >
    <Box sx={{ ...modalCardSx, ...sx }}>
      <Stack spacing={2}>{children}</Stack>
    </Box>
  </Modal>
);

export const AppModalActions = ({ children }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center">
    {children}
  </Stack>
);
