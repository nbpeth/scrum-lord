import * as uuid from "uuid";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import useCommunity from "../../hooks/useCommunity";

// some day, styled components
const useStyles = makeStyles({
  moveit1: {
    animation: `$move-it-1 3s ease-in-out`,
  },
  moveit2: {
    animation: `$move-it-2 3s ease-in-out`,
  },
  moveit3: {
    animation: `$move-it-3 3s ease-in-out`,
  },
  moveit4: {
    animation: `$move-it-4 3s ease-in-out`,
  },
  moveit5: {
    animation: `$move-it-5 3s ease-in-out`,
  },
  moveit6: {
    animation: `$move-it-6 3s ease-in-out`,
  },
  "@keyframes move-it-1": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "40%", transform: "scale(7)" },
  },
  "@keyframes move-it-2": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "30%", transform: "scale(6)" },
  },
  "@keyframes move-it-3": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "50%", transform: "scale(5)" },
  },
  "@keyframes move-it-4": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "60%", transform: "scale(4)" },
  },
  "@keyframes move-it-5": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "70%", transform: "scale(5)" },
  },
  "@keyframes move-it-6": {
    "0%": { top: "90%", opacity: 1, left: "50%", transform: "scale(1)" },
    "100%": { top: "0%", opacity: 0, left: "20%", transform: "scale(6)" },
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
  const [x, _] = useState(Math.floor(Math.random() * (6-1 + 1)) + 1);
  const classX = classes[`moveit${x}`]

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
      className={classX}
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
