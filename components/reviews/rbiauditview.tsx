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
            <TableHead className="text-gray-400">Assigned To</TableHead>
            <TableHead className="text-gray-400">Department</TableHead>
            <TableHead className="text-gray-400">Submitted Date</TableHead>
            <TableHead className="text-gray-400">Progress</TableHead>
            <TableHead className="text-gray-400 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRbiAuditReviews.length > 0 ? (
            filteredRbiAuditReviews.map((review) => (
              <TableRow
                key={review?.id}
                className="border-gray-700 hover:bg-gray-800"
              >
                <TableCell className="text-white font-mono">
                  {review?.observationNumber}
                </TableCell>
                <TableCell className="text-white">{review?.title}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-1">
                    {getRbiCategoryIcon(review.auditCategory)}
                    <span>{review.auditCategory}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      review.severity === "Critical"
                        ? "bg-red-500"
                        : review.severity === "High"
                        ? "bg-orange-500"
                        : review.severity === "Medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {review.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">
                  {review.assignedTo}
                </TableCell>
                <TableCell className="text-gray-300">
                  {review.assignedDepartment}
                </TableCell>
                <TableCell className="text-gray-300">
                  {new Date(review.submittedDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-gray-300">
                  {review.progress}%
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => {
                      setSelectedReview(review);
                      setShowReviewDialog(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-gray-700">
              <TableCell colSpan={9} className="text-center text-gray-400 py-8">
                No RBI audit reviews pending
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export default Rbiauditview;
