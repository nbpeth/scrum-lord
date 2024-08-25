import * as uuid from "uuid";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import useCommunity from "../../hooks/useCommunity";

const useStyles = makeStyles({
  moveit: {
    animation: `$move-it 3s ease-in-out`,
  },

  // "@keyframes move-it": {
  //   "0%": { top: "90%", opacity: 1, left: "50%" },
  //   "100%": { top: "40%", opacity: 0, left: "40%" },
  // },
  "@keyframes move-it": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "40%", transform: "scale(5)" },
  },
});

export const ReactionMachine = () => {
  const [reactions, setReactions] = useState([]);
  const { lastReaction } = useCommunity();

  useEffect(() => {
    if (!lastReaction) return;

    const newReaction = { ...lastReaction, id: uuid.v4() };
    setReactions((prevReactions) => [...prevReactions, newReaction]);
  }, [lastReaction]);

  // useEffect(() => {
  //   console.log(reactions.length);
  // }, [reactions])

  return (
    <div id="reaction-container">
      {reactions.map((reaction) => (
        <Reaction
          key={reaction.id}
          id={reaction.id}
          message={reaction.message}
          setReactions={setReactions}
        />
      ))}
    </div>
  );
};

const Reaction = ({ id, message, setReactions }) => {
  const classes = useStyles({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setReactions((prevReactions) =>
        prevReactions.filter((reaction) => reaction.id !== id)
      );
    }, 2500);

    return () => clearTimeout(timeoutId); 
  }, [id, setReactions]);

  return (
    <div
      className={classes.moveit}
      style={{
        position: "absolute",
        top: "90%",
        transform: "translate(-50%, -50%)",

        fontSize: "3rem",
      }}
    >
      {message}
    </div>
  );
};