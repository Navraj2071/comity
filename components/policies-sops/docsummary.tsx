import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, AlertTriangle } from "lucide-react";

const Summary = ({ documents }: any) => {
  const getDueDate = (doc: any) => {
    const createdDate = new Date(doc.createdDate);
    const dueDate = new Date(createdDate);
    if (doc.reviewFrequency === "Annually") {
      dueDate.setMonth(dueDate.getMonth() + 12);
    } else if (doc.reviewFrequency === "Bi-annually") {
      dueDate.setMonth(dueDate.getMonth() + 6);
    } else if (doc.reviewFrequency === "Quarterly") {
      dueDate.setMonth(dueDate.getMonth() + 3);
    }
    return dueDate;
  };
  const getlatestVersion = (doc: any) => {
    let latestVersion = doc.versioons[0];
    doc.versions.map((version: any) => {
      if (new Date(version.uploadDate) > new Date(latestVersion.uploadDate)) {
        latestVersion = version;
      }
    });
    return latestVersion;
  };
  const getOverDue = () => {
    let overdue = 0;
    documents.map((doc: any) => {
      let duedate = getDueDate(doc);
      let createddate = new Date(doc.createdDate);
    });
    return overdue;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-white">
                {documents?.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Due Soon</p>
              <p className="text-2xl font-bold text-yellow-400">{5}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{10}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
