export const boardSx = {
  width: "100%",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  position: "relative",
  isolation: "isolate",
  display: "flex",
  flexDirection: "column",
};

export const messageListSx = {
  flex: 1,
  minHeight: 0,
  padding: "10px",
  overflowX: "hidden",
  overflowY: "auto",
  maxHeight: { xs: 300, md: "none" },
};

export const messageItemSx = { padding: 0 };

export const messageTextSx = {
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

export const messagePrefixSx = (theme) => ({
  color: theme.palette.grey[500],
});

export const messageBodySx = (userColor) => ({ color: userColor });
