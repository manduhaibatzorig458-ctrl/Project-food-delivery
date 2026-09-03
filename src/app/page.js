"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Button type="button">
        <Plus />
        Add dish
      </Button>
    </div>
  );
}
