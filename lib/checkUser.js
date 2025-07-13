import { users } from "@clerk/clerk-sdk-node";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const existing = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (existing) return existing;

    const name = `${user.firstName} ${user.lastName}`;
    const username = name.split(" ").join("-") + user.id.slice(-4);

    await users.updateUser(user.id, { username }); 

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        username,
      },
    });

    return newUser;
  } catch (error) {
    console.error(" Clerk checkUser error:", error);
  }
};
