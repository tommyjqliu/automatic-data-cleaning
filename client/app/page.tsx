"use client";

import { Button } from "@/components/ui/button";
import triggerUpload from "@/lib/single-upload";

export default function Home() {

  const handleUpload = async () => {
    const file = await triggerUpload();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/parse", {
      method: "POST",
      body: formData,
    });

    console.log(response);
  };

  const testApi = async () => {
    const response = await fetch("/api/hello");
    console.log(response);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={handleUpload}>Upload</Button>
      <Button onClick={testApi}>Test API</Button>
    </div>
  );
}
