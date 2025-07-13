"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function updateUsername(username) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  
  const existingUser = await db.user.findUnique({
    where: { username },
  });

  if (existingUser && existingUser.clerkUserId !== user.id) {
    throw new Error("Username is already taken");
  }

  
  await db.user.update({
    where: { clerkUserId: user.id },
    data: { username },
  });

  
  await clerkClient.users.updateUser(user.id, {
    username,
  });

  return { success: true };
}



export async function getUserByUsername(username) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      events: {
        where: {
          isPrivate: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          isPrivate: true,
          _count: {
            select: { bookings: true },
          },
        },
      },
    },
  });

  return user;
}