import { Suspense } from "react";
import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/event-card";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EventsPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <Suspense fallback={<div>Loading events...</div>}>
      <Events />
    </Suspense>
  );
}

async function Events() {
  const { events, username } = await getUserEvents();

  if (events.length === 0) {
    return <p>You haven&apos;t created any events yet.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {events?.map((event) => (
        <EventCard key={event.id} event={event} username={username} />
      ))}
    </div>
  );
}
