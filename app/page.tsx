"use client";

import { Button } from "@/components/ui/button";
import triggerUpload from "@/lib/single-upload";
import Image from "next/image";

export default function Home() {

  const handleUpload = async () => {
    const file = await triggerUpload();
    console.log(file);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
