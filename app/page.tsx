"use client";

import TypeSelect from "@/components/type_select";
import { Button } from "@/components/ui/button";
import triggerUpload from "@/lib/single_upload";
import { Statistic, Statistics } from "@/lib/type";
import { useRef, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import parseCsv from "@/lib/parse_csv";
import downloadCsv from "@/lib/download_csv";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import errorHandler from "@/app/error_handler";

export default function Home() {
  const fileRef = useRef<File | null>(null);
  const { toast } = useToast();
  const [statistics, setStatistics] = useState<Statistics>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [csv, setCsv] = useState<Record<string, string>[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleUpload = errorHandler(toast, async () => {
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

    const response = await axios.postForm("/api/auto_parse", {
      file,
    });
    const data = response.data;
    const csv = await parseCsv(data.data);

    setCsv(csv);
    setHeaders(Object.keys(csv[0]));
    setStatistics(data.statistics);
    setSelectedTypes(
      data.statistics.map((statistic: Statistic[]) => statistic[0].type)
    );
  });

  const handleTypeSetting = errorHandler(toast, async (types: string[]) => {
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
  });

  const columns: ColumnDef<Record<string, string>>[] = headers.map((header) => {
    return {
      header: (column) => {
        const index = column.header.index;
        return (
          <div className="flex items-center gap-2">
            <span>{header}</span>
            <TypeSelect
              statistics={statistics[index]}
              value={selectedTypes[index]}
              onChange={(value) => {
                const newSelectedTypes = [...selectedTypes];
                newSelectedTypes[index] = value;
                setSelectedTypes(newSelectedTypes);
                handleTypeSetting(newSelectedTypes);
              }}
            />
          </div>
        );
      },
      accessorKey: header,
    };
  });

  const table = useReactTable({
    data: csv,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automatic Data Cleaning</h1>
        <div className="flex gap-2">
          <Button onClick={handleUpload}>Upload CSV</Button>
          <Button
            disabled={csv.length === 0}
            onClick={() => downloadCsv(csv, headers)}
          >
            Download Cleaned CSV
          </Button>
        </div>
      </header>
      <main>
        {csv.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No data uploaded. Please upload a CSV file to begin.
          </div>
        )}
      </main>
    </div>
  );
}
