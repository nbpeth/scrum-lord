import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputBase, Paper } from "@mui/material";
import {
  searchFormSx,
  searchIconButtonSx,
  searchInputSx,
} from "./SearchInput.styles";

export const SearchInput = ({ onChange }) => {
  return (
    <Paper component="form" sx={searchFormSx}>
      <InputBase
        onChange={onChange}
        sx={searchInputSx}
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
      />
      <IconButton type="button" sx={searchIconButtonSx} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
