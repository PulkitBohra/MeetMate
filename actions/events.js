"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { eventSchema } from "@/app/lib/validators";
import { currentUser } from "@clerk/nextjs/server";

export async function createEvent(data) {
    const user1 = await currentUser();
    if (!user1) throw new Error("Unauthorized");
    
    const userId= user1.id;

  const validatedData = eventSchema.parse(data);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.create({
    data: {
      ...validatedData,
      userId: user.id,
    },
  });

  return event;
}

export async function getUserEvents() {
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
  
    const events = await db.event.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
  
    return { events, username: dbUser.username };
  }
  
  export async function deleteEvent(eventId) {
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
  
    const event = await db.event.findUnique({
      where: { id: eventId },
    });
  
    if (!event || event.userId !== dbUser.id) {
      throw new Error("Event not found or unauthorized");
    }
  
    await db.event.delete({
      where: { id: eventId },
    });
  
    return { success: true };
  }

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}