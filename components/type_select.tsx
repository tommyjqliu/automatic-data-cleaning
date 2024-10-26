import { Statistic } from "@/lib/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
      <SelectTrigger className="w-[140px] border-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statistics.map((statistic) => {
          return (
            <SelectItem key={statistic.type} value={statistic.type}>
              {statistic.type}: {statistic.ratio}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
