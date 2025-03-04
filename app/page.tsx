"use client";

import { Button } from "@/components/ui/button";
import triggerUpload from "@/lib/single_upload";
import { Statistic, Statistics } from "@/lib/type";
import { useCallback, useRef, useState } from "react";
import parseCsv from "@/lib/parse_csv";
import downloadCsv from "@/lib/download_csv";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import errorHandler from "@/app/error_handler";
import DataTable from "@/components/data-table";
import stringToCsv from "@/lib/string_to_file";

export default function Home() {
  const fileRef = useRef<File | null>(null);
  const { toast } = useToast();
  const [statistics, setStatistics] = useState<Statistics>([]);
  const [csv, setCsv] = useState<Record<string, string>[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = errorHandler(
    toast,
    async () => {
      const file = await triggerUpload({ accept: ".csv,.xls,.xlsx" });
      if (!file) return;
      const extension = file.name.split(".").at(-1) ?? "";
      if (!["csv", "xlsx", "xls"].includes(extension)) {
        toast({
          title: "Unsupported file format",
          variant: "destructive",
          description: "Please upload a CSV or Excel file.",
        });
        return;
      }

      setIsUploading(true);
      const response = await axios.postForm("/api/auto_parse", {
        file,
      });
      const data = response.data;
      const csv = await parseCsv(data.data);
      fileRef.current = file;
      setCsv(csv);
      setStatistics(data.statistics);
      setSelectedTypes(
        data.statistics.map((statistic: Statistic[]) => statistic[0].type)
      );
    },
    () => setIsUploading(false)
  );

  const handleTypeChange = useCallback(
    errorHandler(toast, async (types: string[]) => {
      setSelectedTypes(types);
      if (!fileRef.current) return;
      const formData = new FormData();
      formData.append("file", fileRef.current);
      formData.append("types", types.join(","));
      const response = await fetch("/api/manual_parse", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setCsv(await parseCsv(data.data));
    }),
    [toast]
  );

  const [isExampleLoading, setIsExampleLoading] = useState(false);
  const handleExample = errorHandler(
    toast,
    async () => {
      setIsExampleLoading(true);
      const response = await axios.get("/api/example_parse");
      const data = response.data;
      fileRef.current = stringToCsv(data.data, "example.csv");
      setCsv(await parseCsv(data.data));
      setStatistics(data.statistics);
      setSelectedTypes(
        data.statistics.map((statistic: Statistic[]) => statistic[0].type)
      );
      setIsExampleLoading(false);
    },
    () => setIsExampleLoading(false)
  );

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automatic Data Cleaning</h1>
          <p className="text-gray-500 mt-2">
            Automatically detect data types and clean your dataset in seconds
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleUpload} loading={isUploading}>
            Upload Dataset
          </Button>
          <Button disabled={csv.length === 0} onClick={() => downloadCsv(csv)}>
            Download Cleaned Dataset
          </Button>
        </div>
      </header>
      <main className="flex-1 h-0">
        {csv.length > 0 ? (
          <DataTable
            data={csv}
            statistics={statistics}
            selectedTypes={selectedTypes}
            onSelectedTypesChange={handleTypeChange}
          />
        ) : (
          <div className="text-center text-gray-500 flex flex-col">
            No data uploaded. Please upload a CSV/Excel file to begin.
            <Button onClick={handleExample} variant="link" loading={isExampleLoading}>
              Try Example Dataset
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
