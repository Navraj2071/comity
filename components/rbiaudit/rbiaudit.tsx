"use client";

import Categorycards from "./categorycards";
import Statsdisplay from "./statsdisplay";
import Departmentstats from "./departmentstats";
import Filters from "./filters";
import Observationtable from "./observationtable";
import Header from "./header";
import useaudit from "./useaudit";
import Addialog from "./dialogs/adddialog";
import Editdialog from "./dialogs/editdialog";
import Detailsdialog from "./dialogs/detailsdialog";
import Bulkuploaddialog from "./dialogs/bulkuploaddialog";

export default function RBIAuditPage() {
  const audit = useaudit();

  return (
    <main className="flex-1 p-6 overflow-y-scroll">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header audit={audit} />

        <Categorycards audit={audit} />

        <Statsdisplay audit={audit} />

        <Departmentstats audit={audit} />

        <Filters audit={audit} />

        <Observationtable audit={audit} />
      </div>
      <Addialog audit={audit} />
      <Editdialog audit={audit} />
      <Detailsdialog audit={audit} />
      <Bulkuploaddialog audit={audit} />
    </main>
  );
}
