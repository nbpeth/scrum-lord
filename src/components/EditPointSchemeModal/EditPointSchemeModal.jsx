import { Button, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { VoteOptions, VoteOptionsLabels } from "../../util/voteOptions";
import { AppModal, AppModalActions } from "../AppModal/AppModal";

export const EditPointSchemeModal = ({
  open,
  editPointScheme,
  handleClose,
  community,
  iamCitizen,
}) => {
  const [selectedScheme, setSelectedScheme] = useState(
    community?.pointScheme ?? "fibonacci"
  );

  const onUpdate = () => {
    editPointScheme({ scheme: selectedScheme, ...iamCitizen });
    handleClose();
  };

  return (
    <AppModal open={open} onClose={handleClose}>
      <Typography variant="body2">
        Change the community's point scheme
      </Typography>
      <Select
        fullWidth
        id="scheme-selector"
        value={selectedScheme}
        onChange={(e) => setSelectedScheme(e.target.value)}
      >
        {Object.keys(VoteOptions).map((option) => (
          <MenuItem key={option} value={option}>
            {VoteOptionsLabels[option]}
          </MenuItem>
        ))}
      </Select>
      <AppModalActions>
        <Button onClick={onUpdate}>Update</Button>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
      </AppModalActions>
    </AppModal>
  );
};
