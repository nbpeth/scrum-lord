import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Link } from "react-router-dom";

export const PrivateCommunityCallbackModal = ({ open, handleClose, data }) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      <Box sx={style}>
        <Grid
          container
          justifyContent="center"
          direction="column"
          spacing={2}
          xs={12}
        >
          <Grid item>
            <Typography variant="h6">Community Created</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1"></Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link
                style={{ textDecoration: "none" }}
                to={`/communities/${data?.id}`}
              >
                {data?.name}
              </Link>
            </Typography>
          </Grid>
          <Grid container item xs={12} justifyContent="flex-end">
            <Grid item>
              <Button color="primary" onClick={() => handleClose()}>
                Close
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
