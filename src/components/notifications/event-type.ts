export const getEventTypeString = (type: string) => {
  if (type == "comment-task") {
    return "commented on a task";
  } else {
    return "perform a action";
  }
};
