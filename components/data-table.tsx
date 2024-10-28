import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Statistics } from "@/lib/type";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { memo, useMemo, useRef } from "react";
import TypeSelect from "./type_select";
import { useVirtualizer } from "@tanstack/react-virtual";

export interface DataTableProps<TData extends Record<string, string>> {
  data: TData[];
  selectedTypes: string[];
  onSelectedTypesChange: (types: string[]) => void;
  statistics: Statistics;
}

function DataTableHeader({
  columns,
}: {
  columns: ColumnDef<Record<string, string>>[];
}) {
  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <TableHeader className="grid sticky top-0 z-10 bg-white">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="flex">
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                className="h-auto"
                style={{ width: header.getSize() }}
              >
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
  );
}

const MemoizedDataTableHeader = memo(DataTableHeader);

export function DataTable<TData extends Record<string, string>>({
  data,
  selectedTypes,
  onSelectedTypesChange,
  statistics,
}: DataTableProps<TData>) {
  const columns: ColumnDef<Record<string, string>>[] = useMemo(() => {
    const headers = Object.keys(data[0]);
    return headers.map((header) => {
      return {
        header: (column) => {
          const index = column.header.index;
          return (
            <div className="py-2">
              <div>{header}</div>
              <TypeSelect
                statistics={statistics[index]}
                value={selectedTypes[index]}
                onChange={(value) => {
                  const nextSelectedTypes = [...selectedTypes];
                  nextSelectedTypes[index] = value;
                  onSelectedTypesChange(nextSelectedTypes);
                }}
              />
            </div>
          );
        },
        size: 160,
        accessorKey: header,
      };
    });
  }, [data, statistics, selectedTypes, onSelectedTypesChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 37,
  });

  return (
    <div
      className="flex-1 h-full rounded-md border overflow-y-auto relative"
      ref={parentRef}
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <Table className="grid">
          <MemoizedDataTableHeader columns={columns} />
          <TableBody
            className="grid relative"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {rows?.length ? (
              virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="flex absolute w-full"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap"
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
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
    </div>
  );
}

export default DataTable;
