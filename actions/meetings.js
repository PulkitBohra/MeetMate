"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { google } from "googleapis";
import { redirect } from "next/navigation";

async function getGoogleToken(clerkUserId) {
  try {
    const response = await fetch(
      `https://api.clerk.com/v1/users/${clerkUserId}/oauth_access_tokens/oauth_google`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Google OAuth token: ${await response.text()}`);
    }

    const data = await response.json();
    return data[0]?.token;
  } catch (error) {
    console.error(" Clerk API OAuth error:", error);
    throw new Error("Google token fetch failed");
  }
}

export async function getUserMeetings(type = "upcoming") {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const now = new Date();

  const meetings = await db.booking.findMany({
    where: {
      userId: dbUser.id,
      startTime: type === "upcoming" ? { gte: now } : { lt: now },
    },
    include: {
      event: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: type === "upcoming" ? "asc" : "desc",
    },
  });

  return meetings;
}

export async function cancelMeeting(meetingId) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const meeting = await db.booking.findUnique({
    where: { id: meetingId },
    include: { event: true, user: true },
  });

  if (!meeting || meeting.userId !== dbUser.id) {
    throw new Error("Meeting not found or unauthorized");
  }


  const token = await getGoogleToken(meeting.user.clerkUserId);
  if (!token) throw new Error("User has not connected Google Calendar");

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId: meeting.googleEventId,
    });
  } catch (error) {
    console.error("Failed to delete event from Google Calendar:", error);
  }


  await db.booking.delete({
    where: { id: meetingId },
  });

  return { success: true };
}
