"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-center">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
        Welcome to <span className="text-yellow-600">Major</span>
      </h1>
      <p className="mt-3 text-lg text-gray-700 md:text-xl">
        Sign up or log in to explore our features.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <Link href="/signin">
          <button className="hover:cursor-pointer rounded-lg bg-yellow-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all duration-300 hover:bg-yellow-600 focus:outline-none">
            Sign In
          </button>
        </Link>

        <Link href="/signup">
          <button className="hover: cursor-pointer rounded-lg border border-yellow-600 bg-white px-6 py-3 text-lg font-semibold text-yellow-600 shadow-md transition-all duration-300 hover:bg-yellow-600 hover:text-white focus:outline-none">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
