"use client";

import { useSearchParams } from "next/navigation";

export default function NotFoundClient() {
  const params = useSearchParams();
  const message = params.get("message") || "404 - Page Not Found";

  return (
    <h1 className="text-4xl font-extrabold">{message}</h1>
  );
}
