import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filters = ({ data }: any) => {
  const {
    checkpointType,
    setCheckpointType,
    financialYear,
    setFinancialYear,
    frequency,
    setFrequency,
    period,
    setPeriod,
    financialYearsList,
    monthsList,
    quartersList,
    halfYearsList,
    yearsList,
  } = data;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center bg-gray-800 rounded-md border border-gray-700 p-1">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs px-3 py-1 h-7 ${
            checkpointType === "ad-hoc"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setCheckpointType("ad-hoc")}
        >
          Ad-hoc
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs px-3 py-1 h-7 ${
            checkpointType === "recurring"
              ? "bg-gray-700 text-white"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setCheckpointType("recurring")}
        >
          Recurring
        </Button>
      </div>

      {checkpointType === "ad-hoc" ? (
        <Select value={financialYear} onValueChange={setFinancialYear}>
          <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-44 text-xs">
            <SelectValue placeholder="Financial Year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            {financialYearsList.map((year: string) => (
              <SelectItem key={year} value={year} className="text-xs">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center space-x-2">
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="monthly" className="text-xs">
                Monthly
              </SelectItem>
              <SelectItem value="quarterly" className="text-xs">
                Quarterly
              </SelectItem>
              <SelectItem value="half-yearly" className="text-xs">
                Half-Yearly
              </SelectItem>
              <SelectItem value="annually" className="text-xs">
                Annually
              </SelectItem>
            </SelectContent>
          </Select>

          {frequency === "monthly" && (
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {monthsList.map((month: any) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="text-xs"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {frequency === "quarterly" && (
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {quartersList.map((quarter: any) => (
                  <SelectItem
                    key={quarter.value}
                    value={quarter.value}
                    className="text-xs"
                  >
                    {quarter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {frequency === "half-yearly" && (
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                <SelectValue placeholder="Half Year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {halfYearsList.map((half: any) => (
                  <SelectItem
                    key={half.value}
                    value={half.value}
                    className="text-xs"
                  >
                    {half.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {frequency === "annually" && (
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="bg-gray-800 border-gray-700 h-8 w-32 text-xs">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {yearsList.map((year: any) => (
                  <SelectItem
                    key={year.value}
                    value={year.value}
                    className="text-xs"
                  >
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};

export default Filters;
