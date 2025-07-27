import React from "react";

const Rbiauditview = () => {
  return (
    <TabsContent value="rbi-audit" className="mt-0">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800">
            <TableHead className="text-gray-400">Observation No.</TableHead>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">Category</TableHead>
            <TableHead className="text-gray-400">Severity</TableHead>
            <TableHead className="text-gray-400">Target Date</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Progress</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRbiAuditSubmissions.length > 0 ? (
            filteredRbiAuditSubmissions.map((submission) => (
              <TableRow
                key={submission.id}
                className="border-gray-700 hover:bg-gray-800"
              >
                <TableCell className="text-white font-mono">
                  {submission.observationNumber}
                </TableCell>
                <TableCell className="text-white">{submission.title}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-1">
                    {getRbiCategoryIcon(submission.auditCategory)}
                    <span>{submission.auditCategory}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      submission.severity === "Critical"
                        ? "bg-red-500"
                        : submission.severity === "High"
                        ? "bg-orange-500"
                        : submission.severity === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {submission.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  {new Date(submission.targetDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell className="text-gray-300">
                  {submission.progress}%
                </TableCell>
                <TableCell className="text-right">
                  {submission.status !== "Pending Closure" &&
                    submission.status !== "Closed" && (
                      <Button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowSubmitDialog(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        Submit
                      </Button>
                    )}
                  {(submission.status === "Pending Closure" ||
                    submission.status === "Closed") && (
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-gray-700">
              <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                No RBI audit submissions found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export default Rbiauditview;
