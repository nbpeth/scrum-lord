export const menuIconSx = { cursor: "pointer" };

export const menuIconWrapperSx = { marginTop: "5px" };

export const homeLinkStyle = { textDecoration: "none", color: "inherit" };

// Narrow headers need the room name; Home is still one tap away in the menu.
export const appTitleWrapperSx = { display: { xs: "none", md: "block" } };

export const appTitleSx = (theme) => ({
  flexGrow: 1,
  color: theme.palette.secondary.dark,
});
