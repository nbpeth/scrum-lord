import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  bodySx,
  bodyTextSx,
  closeButtonSx,
  dotSx,
  dotsRowSx,
  footerStackSx,
  headerStackSx,
  illustrationSx,
  stepCountSx,
  tutorialPaperSx,
} from "./TutorialModal.styles";

export const TutorialModal = ({ open, handleClose, pages }) => {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setPageIndex(0);
    }
  }, [open]);

  const page = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;

  const next = () => (isLastPage ? handleClose() : setPageIndex(pageIndex + 1));

  return (
    <Modal id="tutorial-modal" open={open} onClose={handleClose}>
      <Paper elevation={12} sx={tutorialPaperSx}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={1}
          sx={headerStackSx}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={stepCountSx}>
              {`Step ${pageIndex + 1} of ${pages.length}`}
            </Typography>
            <Typography variant="h5" component="h2" fontWeight={700}>
              {page.title}
            </Typography>
          </Box>
          <IconButton
            id="tutorial-close-button"
            aria-label="Close"
            size="small"
            onClick={handleClose}
            sx={closeButtonSx}
          >
            <Close />
          </IconButton>
        </Stack>

        <Box sx={bodySx}>
          <Box sx={illustrationSx}>{page.art}</Box>
          <Typography variant="body1" color="text.secondary" sx={bodyTextSx}>
            {page.body}
          </Typography>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={footerStackSx}
        >
          <Button
            id="tutorial-back-button"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            Back
          </Button>
          <Stack direction="row" spacing={1} sx={dotsRowSx}>
            {pages.map((_, index) => (
              <Box key={index} sx={dotSx(index === pageIndex)} />
            ))}
          </Stack>
          <Button id="tutorial-next-button" variant="contained" onClick={next}>
            {isLastPage ? "Done" : "Next"}
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};
