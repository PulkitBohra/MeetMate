"use server";

import { db } from "@/lib/prisma";

export async function getLatestUpdates(userId) {
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) throw new Error("User not found");

  const now = new Date();

  const upcomingMeetings = await db.booking.findMany({
    where: {
      userId: dbUser.id,
      startTime: { gte: now },
    },
    include: {
      event: {
        select: { title: true },
      },
    },
    orderBy: {
      startTime: "asc",
    },
    take: 3,
  });

  return upcomingMeetings;
}
