"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { Feedback } from "@prisma/client";

export async function feedbackCreationAction(
  values: Feedback,
  projectID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        createdBy: user.id,
        title: values.title,
        link: values.link,
        note: values.note,
        projectId: projectID,
      },
    });
    return newFeedback;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function getProjectFeedbacks(projectID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        projectId: projectID,
      },
      include: {
        user: true,
      },
    });

    return feedbacks;
  } catch (error) {
    throw new Error("Error databse");
  }
}

export async function feedbackUpdatetAction(
  values: Feedback,
  feedbackID: string
) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const feedback = await prisma.feedback.update({
      where: {
        id: feedbackID,
      },
      data: {
        title: values.title,
        link: values.link,
        note: values.note,
      },
    });
    return feedback;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

export async function feedbackDeleteAction(feedbackID: string) {
  const user = await auth();

  if (!user) {
    return;
  }

  try {
    const feedback = await prisma.feedback.delete({
      where: {
        id: feedbackID,
      },
    });
    return feedback;
  } catch (error) {
    console.log(error);
    throw new Error("Error Will Create Entries");
  }
}

// export async function projectUpdateAction(
//   values: newProjectActionType,
//   projectId: string,
//   sMembers: any
// ) {
//   const user = await auth();

//   if (!user) {
//     return;
//   }

//   try {
//     const updatedProject = await prisma.project.update({
//       where: {
//         id: projectId,
//       },
//       data: {
//         title: values.title,
//         description: values.description,
//         cover: values.cover,
//         priority: values.priority,
//         startDate: values.startDate,
//         endDate: values.endDate,
//         status: values.status,
//         tags: values.tags,
//       },
//     });

//     if (updatedProject) {
//       for (const sMember of sMembers) {
//         await prisma.teamMember.update({
//           where: { id: sMember.teamMembers.id },
//           data: {
//             projects: {
//               connect: {
//                 id: updatedProject.id,
//               },
//             },
//           },
//         });
//       }

//       return updatedProject;
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error Will Create Entries");
//   }
// }

// export async function projectRemoveTeamMemberAction(
//   projectId: string,
//   sMember: any
// ) {
//   const user = await auth();

//   if (!user) {
//     return;
//   }

//   try {
//     const member = await prisma.teamMember.update({
//       where: { id: sMember.teamMembers.id },
//       data: {
//         projects: {
//           disconnect: {
//             id: projectId,
//           },
//         },
//       },
//     });

//     if (member) {
//       return member;
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error While disconect teamMember Entries");
//   }
// }
