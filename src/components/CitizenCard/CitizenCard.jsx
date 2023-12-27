import { Button, Card, CardActionArea, CardActions, CardContent, useTheme } from "@mui/material";

export const CitizenCard = ({ citizen, handleDeleteUser, iAmCitizen }) => {
  const isMe = iAmCitizen && citizen.userId === iAmCitizen.userId;
  // const theme = useTheme();
  return (
    <Card  key={citizen.id} variant="outlined">
      {
        isMe && (
          <CardContent>
            <h3>Me</h3>
          </CardContent>
        )
      }
      <CardContent>
        <h3>{citizen.username}</h3>
        <h1>{citizen.vote}</h1>
      </CardContent>
      <CardActionArea>
        <CardActions>
            <Button onClick={() => handleDeleteUser(citizen)}>Delete</Button>
        </CardActions>
      </CardActionArea>
    </Card>
  );
};
