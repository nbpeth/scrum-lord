import {
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

const calculateAverageNumbers = (numbers) => {
  if (!numbers.length) return 0;
  const actualVotes = numbers.filter((n) => n !== undefined && n !== null);
  const sum = actualVotes.reduce((total, num) => total + num, 0);
  const average = sum / actualVotes.length;
  // const hasDecicimal = average % 1 !== 0;

  // return hasDecicimal ? average.toFixed(2) : average.toFixed(0);
  return average?.toFixed(0);
};
export const highestOccurenceOfValues = (arr) => {
  const counts = arr.reduce((res, next) => {
    if (res[next]) {
      res[next]++;
    } else {
      res[next] = 1;
    }

    return res;
  }, {});

  const result = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return result;
};

// write some tests for averages
export const VoteOptions = {
  fibonacci: {
    values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987],
    calculateAverage: calculateAverageNumbers,
  },
  tshirt: {
    values: ["XS", "S", "M", "L", "XL", "XXL"],
    calculateAverage: (votes) => {
      // duplication
      const mostFrequent = highestOccurenceOfValues(votes);
      // todo: something more interesting with the values, e.g., how do you average emojis?
      return mostFrequent;
    },
  },
  yesNo: { values: ["Yes", "No"], calculateAverage: (votes) => {} },
  boolean: { values: ["True", "False"], calculateAverage: (votes) => {} },
  thumbs: {
    values: ["👍", "👎", "🫰", "🤌"],
    calculateAverage: (votes) => {
      const mostFrequent = highestOccurenceOfValues(votes);
      // todo: something more interesting with the values, e.g., how do you average emojis?
      return mostFrequent;
    },
  },
  naturalNumbers: {
    values: Array.from(Array(50).keys()),
    calculateAverage: calculateAverageNumbers,
  },
  deficientNumbers: {
    values: [
      1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 21, 22, 23, 25,
      26, 27, 29, 31, 32, 33, 34, 35, 37, 38, 39, 41, 43, 44, 45, 46, 47, 49,
      50,
    ],
    calculateAverage: calculateAverageNumbers,
  },
  abundantNumbers: {
    values: [
      12, 18, 20, 24, 30, 36, 40, 42, 48, 54, 56, 60, 66, 70, 72, 78, 80, 84,
      88, 90, 96, 100, 102, 104, 108,
    ],
    calculateAverage: calculateAverageNumbers,
  },
  foodEmojis: {
    values: ["🍕", "🍟", "🌭", "🍔", "🧀", "🥔", "🌮", "🥩", "🍖", "🍺", "🥪"],
    calculateAverage: (votes) => {
      const mostFrequent = highestOccurenceOfValues(votes);
      // todo: something more interesting with the values, e.g., how do you average emojis?
      return mostFrequent;
    },
  },
};

export const VoteOptionsLabels = {
  fibonacci: "Fibonacci",
  tshirt: "T-Shirt Sizes",
  yesNo: "Yes/No",
  boolean: "True/False",
  thumbs: "Thumbs",
  naturalNumbers: "Natural Numbers",
  deficientNumbers: "Deficient Numbers",
  abundantNumbers: "Abundant Numbers",
  foodEmojis: "Food Emojis",
};

export const EditPointSchemeModal = ({
  open,
  editPointScheme,
  handleClose,
  community,
  iamCitizen,
}) => {
  const style = {
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [selectedScheme, setSelectedScheme] = useState(community?.pointScheme);

  const close = () => {
    handleClose();
  };

  const onUpdate = () => {
    editPointScheme({ scheme: selectedScheme, ...iamCitizen });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          close();
        }
      }}
    >
      <Box sx={style}>
        <Grid
          container
          justifyContent="center"
          direction="column"
          spacing={2}
          xs={12}
        >
          <Grid item>
            <Typography variant="body2">
              Change the community's point scheme
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Select
              fullWidth
              labelId="scheme-selector-label"
              id="scheme-selector"
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
            >
              {Object.keys(VoteOptions)?.map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {VoteOptionsLabels[option]}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid container item xs={12} justifyContent="space-between">
            <Grid item>
              <Button onClick={onUpdate}>Update</Button>
            </Grid>
            <Grid item>
              <Button color="error" onClick={() => close()}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
