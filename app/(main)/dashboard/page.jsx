"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/app/lib/validators";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }

    if (isLoaded && !user) {
      router.push("/sign-in"); 
    }
  }, [isLoaded, user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    if (user?.username) {
      setValue("username", user.username);
    }
  }, [user]);

  const {
    loading: loadingUpdates,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(getLatestUpdates);

  useEffect(() => {
    if (user) {
      fnUpdates(user.id);
    }
  }, [user]);

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}!</CardTitle>
        </CardHeader>
        <CardContent>
          {!loadingUpdates ? (
            <div className="space-y-6 font-light">
              {upcomingMeetings && upcomingMeetings.length > 0 ? (
                <ul className="list-disc pl-5">
                  {upcomingMeetings.map((meeting) => (
                    <li key={meeting.id}>
                      {meeting.event.title} on{" "}
                      {format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")}{" "}
                      with {meeting.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming meetings</p>
              )}
            </div>
          ) : (
            <p>Loading updates...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2">
              <span>{origin}/</span>
              <Input {...register("username")} placeholder="username" />
            </div>

            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
            {error && (
              <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}

            {loading && (
              <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}
            <Button type="submit" disabled={loading}>
              Update Username
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
