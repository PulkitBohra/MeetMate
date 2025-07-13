import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/create-event";

export const metadata = {
  title: "MeetMate",
  description: "Seamless Meeting Booking and Conflict Resolution Tool",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Header />
        <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
        <footer className="bg-blue-100 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Made with ❤️ by Pulkit Bohra</p>
          </div>
        </footer>
      <CreateEventDrawer/>

      </body>
    </html>
    </ClerkProvider>
  );
}
