import { Card, CardContent, Typography, alpha, useTheme } from "@mui/material";

export const CitizenCard = ({
  citizen,
  currentCommunity,
  handleDeleteUser,
  iAmCitizen,
}) => {
  const isMyCard = iAmCitizen && citizen.userId === iAmCitizen.userId;
  const theme = useTheme();
  const { revealed } = currentCommunity;
  const { vote, hasVoted, username } = citizen;

  // drag and drop cards https://stackoverflow.com/questions/60043907/how-to-drag-drop-material-ui-cards
  return (
    <Card
      key={citizen.id}
      variant="outlined"
      sx={{
        backgroundColor: hasVoted
          ? alpha(theme.palette.primary.dark, 0.8)
          : "none",
      }}
    >
      <CardContent
        sx={{
          padding: "5px",
        }}
      >
        <Typography variant="body">{username}</Typography>

        <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
      </CardContent>
    </Card>
  );
};

export const CitizenVote = ({ isMyCard, revealed, vote }) => {
  const getValue = () => {
    if (revealed || isMyCard) {
      return vote ?? "*";
    }
    return "?";
  };

  return (
    <Typography variant="h2" sx={{ fontWeight: "bold" }}>
      {getValue()}
    </Typography>
  );
};
