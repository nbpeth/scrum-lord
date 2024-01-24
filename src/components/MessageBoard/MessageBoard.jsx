import { List, ListItem, Typography, useTheme } from "@mui/material";

export const MessageBoard = ({ messageHistory, communityId }) => {
  const messages = messageHistory
    // all messages are passed in, but we only want to show the ones for the current community
    ?.filter((x) => x.communityId === communityId)
    .reverse()
    .slice(0, 100);

  const theme = useTheme();
  return (
    <div id="community-message-board">
      <List
        sx={{
          padding: "10px",
          overflow: "hidden",
          overflowY: "scroll",
          minHeight: "50px",
          maxHeight: "300px",
        }}
      >
        {messages?.map((message) => {
          return (
            <ListItem sx={{ padding: 0 }} key={message.id}>
              <Typography fontSize="small" variant="body2">
                <span style={{ color: theme.palette.grey[500] }}>~</span>{" "}
                <span style={{ color: message.userColor }}>{message.text}</span>
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
