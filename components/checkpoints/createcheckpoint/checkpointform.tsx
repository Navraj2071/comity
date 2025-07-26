import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Checkpointform = ({ script }: any) => {
  const {
    checkpointForm,
    setCheckpointForm,
    regulatoryDepartments,
    financialYears,
  } = script;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Checkpoint Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="letter-number">Letter/Circular/MD Number</Label>
          <Input
            id="letter-number"
            placeholder="e.g., RBI/2024/001"
            className="bg-gray-700 border-gray-600"
            value={checkpointForm.letterNumber}
            onChange={(e) =>
              setCheckpointForm((prev: any) => ({
                ...prev,
                letterNumber: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            className="bg-gray-700 border-gray-600"
            value={checkpointForm.date}
            onChange={(e) =>
              setCheckpointForm((prev: any) => ({
                ...prev,
                date: e.target.value,
              }))
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regulatory">Regulatory Department</Label>
          <Select
            value={checkpointForm.regulatory}
            onValueChange={(value) =>
              setCheckpointForm((prev: any) => ({
                ...prev,
                regulatory: value,
              }))
            }
          >
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select regulatory body" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {regulatoryDepartments?.map((dept: any, i: number) => (
                <SelectItem value={dept._id} key={`dept-${dept._id}`}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Brief title for the checkpoint"
            className="bg-gray-700 border-gray-600"
            value={checkpointForm.title}
            onChange={(e) =>
              setCheckpointForm((prev: any) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {/* Type-specific fields */}
      <div className="grid grid-cols-2 gap-4">
        {checkpointForm.type === "ad-hoc" && (
          <div className="space-y-2">
            <Label htmlFor="financial-year">Financial Year</Label>
            <Select
              value={checkpointForm.financialYear}
              onValueChange={(value) =>
                setCheckpointForm((prev: any) => ({
                  ...prev,
                  financialYear: value,
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select financial year" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {financialYears.map((year: string) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {checkpointForm.type === "recurring" && (
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={checkpointForm.frequency}
              onValueChange={(value) =>
                setCheckpointForm((prev: any) => ({
                  ...prev,
                  frequency: value,
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Details</Label>
        <Textarea
          id="details"
          placeholder="Detailed description of the compliance requirement"
          className="bg-gray-700 border-gray-600"
          rows={3}
          value={checkpointForm.details}
          onChange={(e) =>
            setCheckpointForm((prev: any) => ({
              ...prev,
              details: e.target.value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default Checkpointform;
