import React from "react";
import AvailabilityForm from "./_components/availability-form";
import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AvailabilityPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const availability = await getUserAvailability();

  return <AvailabilityForm initialData={availability || defaultAvailability} />;
}
