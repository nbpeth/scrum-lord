export const UserTypes = {
  voter: "voter",
  scrumLord: "scrumlord",
};

export const DEFAULT_USER_TYPE = UserTypes.voter;

export const userTypeOptions = [
  {
    value: UserTypes.voter,
    label: "Voter",
    description: "Gets a card and casts points",
  },
  {
    value: UserTypes.scrumLord,
    label: "Scrumlord",
    description: "Runs the room, sits out the vote",
  },
];

export const votingMemberFor = (userType) => userType === UserTypes.voter;

export const isScrumLord = (citizen) =>
  citizen?.userType === UserTypes.scrumLord;
