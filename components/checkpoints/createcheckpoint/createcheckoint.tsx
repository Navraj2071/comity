import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "../../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import usecreate from "./usecreate";
import Subcheckpointform from "./subcheckpointform";
import Bulkupload from "./bulkupload";
import Checkpointform from "./checkpointform";

const CreateCheckpoint = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  store,
}: any) => {
  const script = usecreate(store, setIsCreateDialogOpen);

  const {
    loading,
    status,
    createMode,
    setCreateMode,
    checkpointForm,
    setCheckpointForm,
    handleCreateCheckpoint,
    addSubCheckpoint,
  } = script;

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          New Checkpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Compliance Checkpoint</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add a new regulatory compliance checkpoint with sub-checkpoints.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={createMode}
          onValueChange={setCreateMode}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-gray-600"
            >
              Manual Entry
            </TabsTrigger>
            <TabsTrigger
              value="bulk"
              className="data-[state=active]:bg-gray-600"
            >
              Bulk Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 mt-6">
            {/* Checkpoint Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Checkpoint Type
              </h3>
              <RadioGroup
                value={checkpointForm.type}
                onValueChange={(value) =>
                  setCheckpointForm((prev: any) => ({
                    ...prev,
                    type: value,
                  }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ad-hoc" id="ad-hoc" />
                  <Label htmlFor="ad-hoc">Ad-hoc</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recurring" id="recurring" />
                  <Label htmlFor="recurring">Recurring</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Main Checkpoint Details */}
            <Checkpointform script={script} />

            {/* Sub-checkpoints */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Sub-checkpoints
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentLength =
                      checkpointForm?.subCheckpoints?.length;
                    addSubCheckpoint(currentLength);
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub-checkpoint
                </Button>
              </div>
              <Subcheckpointform script={script} store={store} />
            </div>
          </TabsContent>

          <Bulkupload script={script} />
        </Tabs>

        {status && status !== "" && (
          <Alert className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}

        {createMode === "manual" && (
          <DialogFooter className="pt-4">
            <Button
              type="button"
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={handleCreateCheckpoint}
              disabled={loading || createMode === "bulk"}
            >
              {loading ? (
                <ClipLoader
                  color={"#000000"}
                  loading={true}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <>Create Checkpoint</>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateCheckpoint;
