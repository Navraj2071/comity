import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useapi from "../api/api";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const NewVersionDialog = ({
  isVersionDialogOpen,
  setIsVersionDialogOpen,
  selectedDocument,
  store,
}: any) => {
  const api = useapi();
  const [file, setFile] = useState(null);
  const [changes, setChanges] = useState("");
  const [version, setVersion] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleCreate = async () => {
    if (!file) {
      setStatus("Please select a document");
      return;
    }
    if (changes === "" || version === "") {
      setStatus("Please mention changes and version tag.");
      return;
    }
    setStatus("");
    setLoading(true);
    const url = await api
      .fileUpload(file)
      .then((res) => res.url)
      .catch((err) => "");
    await api
      .createVersion({
        version: version,
        file: url,
        fileName: file.name,
        fileSize: file.size,
        changes: changes,
        sop: selectedDocument._id,
        reviewedBy: getlatestVersion(selectedDocument).reviewedBy,
        approvedBy: getlatestVersion(selectedDocument).approvedBy,
      })
      .then((res) => {
        store.update("sops");
        setIsVersionDialogOpen(false);
      })
      .catch((err) => setStatus(err.message));
    setLoading(false);
  };

  const getlatestVersion = (doc: any) => {
    let latestVersion = doc.versions[0];
    doc.versions.map((version: any) => {
      if (new Date(version.uploadDate) > new Date(latestVersion.uploadDate)) {
        latestVersion = version;
      }
    });
    return latestVersion;
  };

  let versionHelper = "";

  try {
    versionHelper = `( Latest: ${getlatestVersion(selectedDocument).version} )`;
  } catch {}

  return (
    <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Upload New Version</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload a new version of "{selectedDocument?.title}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Document File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="changes">Changes Made</Label>
            <Textarea
              id="changes"
              value={changes}
              onChange={(e) => setChanges(e.target.value)}
              placeholder="Describe the changes made in this version"
              rows={3}
              className="bg-gray-700 border-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version Tag {versionHelper}</Label>
            <Input
              id="version"
              placeholder="Enter version tag e.g. 1.3"
              className="bg-gray-700 border-gray-600"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>
        </div>
        {status && status !== "" && (
          <Alert className="bg-red-900/20 border-red-800 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsVersionDialogOpen(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-yellow-500 hover:bg-yellow-600"
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
              "Upload Version"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewVersionDialog;
