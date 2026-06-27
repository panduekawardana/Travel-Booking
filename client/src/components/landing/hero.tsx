"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

export default function Hero() {
  const [destination, setDestination] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="relative flex min-h-[600px] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,#fafafa_100%)]" />
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
        Explore the world, one journey at a time
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-500">
        Discover extraordinary places, create unforgettable memories. Your next adventure starts here.
      </p>
      <form
        onSubmit={handleSearch}
        className="mt-10 flex w-full max-w-xl items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-neutral-200 transition-shadow focus-within:shadow-md focus-within:ring-neutral-300"
      >
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where do you want to go?"
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
        <Button type="submit" size="md">
          Search
        </Button>
      </form>
      <p className="mt-4 text-xs text-neutral-400">
        Popular: Bali, Tokyo, Paris, Santorini
      </p>
    </section>
  );
}
