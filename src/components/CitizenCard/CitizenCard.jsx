import {
  Card,
  CardActions,
  CardContent,
  Typography,
  alpha,
  Grid,
  useTheme,
} from "@mui/material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import SkateboardingIcon from "@mui/icons-material/Skateboarding";

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
      // variant="outlined"
      sx={{
        padding: "10px",
        minWidth: "100px",
        backgroundColor: hasVoted
          ? alpha(theme.palette.primary.dark, 0.8)
          : "none",
      }}
    >
      <CardContent
        sx={{
          padding: "5px",
          textAlign: "center",
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {isMyCard && (
            <Grid item>
              <SkateboardingIcon fontWeight="bold" fontSize="small" />
            </Grid>
          )}
          <Grid item>
            <Typography variant="body" color={theme.palette.grey[100]}>
              {username}
            </Typography>
          </Grid>
        </Grid>

        <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
      </CardContent>
      <CardActions>
        <DeleteTwoToneIcon
          sx={{ cursor: "pointer" }}
          onClick={() => handleDeleteUser(citizen)}
        />
      </CardActions>
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
    <Typography variant="h1" sx={{ fontWeight: "bold" }}>
      {getValue()}
    </Typography>
  );
};
