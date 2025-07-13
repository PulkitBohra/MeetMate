import { Suspense } from "react";
import NotFoundClient from "./NotFoundClient";

export default function NotFound() {
  return (
    <div className="w-screen pt-96 grid place-items-center">
      <Suspense fallback={<p className="text-lg">Loading...</p>}>
        <NotFoundClient />
      </Suspense>
    </div>
  );
}
