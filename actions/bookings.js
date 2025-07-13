"use server";

import { db } from "@/lib/prisma";
import { google } from "googleapis";

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
    console.error("Clerk API OAuth error:", error);
    throw new Error("Google token fetch failed");
  }
}

export async function createBooking(bookingData) {
  try {
    
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });

    if (!event) throw new Error("Event not found");
    if (!event.user?.clerkUserId) throw new Error("User not connected to Clerk");

    
    const token = await getGoogleToken(event.user.clerkUserId);
    if (!token) throw new Error("User has not connected Google Calendar");

    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    
    const meetResponse = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${bookingData.name} - ${event.title}`,
        description: bookingData.additionalInfo || '',
        start: {
          dateTime: bookingData.startTime,
          timeZone: "UTC",
        },
        end: {
          dateTime: bookingData.endTime,
          timeZone: "UTC",
        },
        attendees: [
          { email: bookingData.email },
          { email: event.user.email },
        ],
        conferenceData: {
          createRequest: {
            requestId: `${event.id}-${Date.now()}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });
    

    const meetLink = meetResponse.data.hangoutLink;
    if (!meetLink) throw new Error("Google Meet link not created");

  
    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.userId,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
        meetLink,
        googleEventId: meetResponse.data.id,
      },
    });

    return {
      success: true,
      booking,
      meetLink,
    };
  } catch (error) {
    console.error(" Error creating booking:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
