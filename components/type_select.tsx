import { Statistic } from "@/lib/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const typeNameMap = {
  int8: "Int8",
  int16: "Int16",
  int32: "Int32",
  int64: "Int64",
  float32: "Float32",
  float64: "Float64",
  complex: "Complex",
  bool: "Bool",
  datetime: "Date",
  timedelta: "Timedelta",
  category: "Category",
  string: "String",
};

export default function TypeSelect({
  statistics,
  value,
  onChange,
}: {
  statistics: Statistic[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value);
      }}
    >
      <SelectTrigger className="w-[140px] border-none p-0 shadow-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statistics.map((statistic) => {
          return (
            <SelectItem key={statistic.type} value={statistic.type}>
              {typeNameMap[statistic.type as keyof typeof typeNameMap]}
              {": "}
              {statistic.ratio.toFixed(2)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
