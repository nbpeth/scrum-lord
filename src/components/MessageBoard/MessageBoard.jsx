import { Box, List, ListItem, Typography, useTheme } from "@mui/material";

export const MessageBoard = ({ messageHistory, communityId }) => {
  const messages = messageHistory
    ?.filter((x) => x.communityId === communityId)
    .reverse()
    .slice(0, 100);

  const theme = useTheme();

  return (
    <Box
      id="community-message-board"
      sx={{
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
      }}
    >
      <List
        sx={{
          flex: 1,
          minHeight: 0,
          padding: "10px",
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: { xs: 300, md: "none" },
        }}
      >
        {messages?.map((message) => {
          return (
            <ListItem sx={{ padding: 0 }} key={message.id}>
              <Typography
                fontSize="small"
                variant="body2"
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                <span style={{ color: theme.palette.grey[500] }}>~</span>{" "}
                <span style={{ color: message.userColor }}>{message.text}</span>
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
