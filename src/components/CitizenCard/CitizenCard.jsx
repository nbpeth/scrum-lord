import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

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
        border: isMyCard ? `1px solid ${theme.palette.primary.dark}` : `1px solid ${theme.palette.grey[800]}`,
        backgroundColor: hasVoted
          ? alpha(theme.palette.primary.dark, 0.8)
          : "none",

        cursor: "pointer",
        transition: "background .5s ease-in-out",
        "&:hover": {
          backgroundColor: alpha(theme.palette.grey[800], 1),
        },
      }}
    >
      <CardContent
        sx={{
          padding: "5px",
          textAlign: "center",
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
     
          <Grid item>
            <Typography variant="body2" color={theme.palette.grey[100]}>
              {username}
            </Typography>
          </Grid>
        </Grid>

        <CitizenVote isMyCard={isMyCard} vote={vote} revealed={revealed} />
      </CardContent>
      <CardActions>
        <DeleteTwoToneIcon
          fontSize="x-small"
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
      return vote ?? "-";
    }
    return "?";
  };

  return (
    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
      {getValue()}
    </Typography>
  );
};
