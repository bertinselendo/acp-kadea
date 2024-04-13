export const getEventTypeString = (type: string) => {
  if (type == "comment-task") {
    return "commented on a task";
  } else if (type == "project-new-document") {
    return "added a new document";
  } else if (type == "project-new-feedback") {
    return "added a new feedback";
  } else if (type == "project-new-invoice") {
    return "added a invoice";
  } else if (type == "project-client-creation") {
    return "added a project";
  } else if (type == "project-team-creation") {
    return "assigned you";
  } else if (type == "team-creation") {
    return "added you";
  } else if (type == "client-creation") {
    return "added you";
  } else {
    return "perform a action";
  }
};
