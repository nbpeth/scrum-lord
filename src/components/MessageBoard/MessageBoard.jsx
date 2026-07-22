import { Box, List, ListItem, Typography } from "@mui/material";
import {
  boardSx,
  messageBodySx,
  messageItemSx,
  messageListSx,
  messagePrefixSx,
  messageTextSx,
} from "./MessageBoard.styles";

const MAX_MESSAGES = 100;

export const MessageBoard = ({ messageHistory, communityId }) => {
  const messages = messageHistory
    ?.filter((message) => message.communityId === communityId)
    .reverse()
    .slice(0, MAX_MESSAGES);

  return (
    <Box id="community-message-board" sx={boardSx}>
      <List sx={messageListSx}>
        {messages?.map((message) => (
          <ListItem sx={messageItemSx} key={message.id}>
            <Typography fontSize="small" variant="body2" sx={messageTextSx}>
              <Box component="span" sx={messagePrefixSx}>
                ~
              </Box>{" "}
              <Box component="span" sx={messageBodySx(message.userColor)}>
                {message.text}
              </Box>
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
