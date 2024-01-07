import { List, ListItem, Typography, useTheme } from "@mui/material";

export const MessageBoard = ({ messageHistory, communityId }) => {
  const messages = messageHistory
    ?.filter((x) => x.communityId === communityId)
    .reverse()
    .slice(0, 100);

  const theme = useTheme();
  return (
    <div>
      <List
        sx={{
          padding: "10px",
          overflow: "hidden",
          overflowY: "scroll",
          height: "300px",
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
