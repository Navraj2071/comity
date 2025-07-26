import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Checkpointview = ({
  selectedCheckpoint,
  setSelectedCheckpoint,
  store,
}: any) => {
  return (
    <Dialog
      open={selectedCheckpoint}
      onOpenChange={(open) => !open && setSelectedCheckpoint(null)}
    >
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            Checkpoint Details
          </DialogTitle>
        </DialogHeader>

        {selectedCheckpoint && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">
                {selectedCheckpoint?.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-blue-600">
                  {store?.tools?.getRegBodyNameFromId(
                    selectedCheckpoint?.regulatory
                  )}
                </Badge>
                <span className="text-sm text-gray-400">
                  {selectedCheckpoint?.letterNumber}
                </span>
                <span className="text-sm text-gray-400">
                  {selectedCheckpoint?.date}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-2">
                {selectedCheckpoint?.details}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-300">Sub-checkpoints:</h4>
              {selectedCheckpoint.subCheckpoints &&
                selectedCheckpoint.subCheckpoints.map((sub: any) => (
                  <SubCheckpointView key={sub._id} sub={sub} store={store} />
                ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Checkpointview;

const SubCheckpointView = ({ sub, store }: any) => {
  const status = store?.tools?.getSubCheckpointStatus(sub._id);
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">{sub?.title}</p>
            <p className="text-xs text-gray-400">
              {store?.tools?.getDepartmentNameFromId(sub?.department)}
            </p>
          </div>
          <Badge
            className={
              status === "compliant"
                ? "bg-green-600"
                : sub.status === "pending"
                ? "bg-yellow-600"
                : sub.status === "overdue"
                ? "bg-orange-600"
                : "bg-red-600"
            }
          >
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
