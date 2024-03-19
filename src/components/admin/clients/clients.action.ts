"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

export async function getClients() {
  // const user = await auth();

  // if (!user) {
  //   return;
  // }

  try {
    const client = await prisma.client.findMany({
      include: {
        users: true, // Inclure les posts associés
      },
    });
    console.log(client);

    return client;
  } catch (error) {
    throw new Error("Error databse");
  }
}

// export async function getClientUsers() {
//   // const user = await auth();

//   // if (!user) {
//   //   return;
//   // }

//   try {
//     const client = await prisma.user.findMany({
//       where: {
//         client
//       }
//     });
//     console.log(client);

//     return client;
//   } catch (error) {
//     throw new Error("Error databse");
//   }
// }
