"use client";

import Filters from "./filters";
import Keymetrics from "./keymetrics";
import Regdeptcards from "./regdeptcards";
import Quickactions from "./quickactions";
import Detailsdialog from "./detailsdialog";
import usedash from "./usedash";

export default function Dashboard() {
  const data = usedash();

  const getPercentageBg = (percentage: number) => {
    if (percentage >= 80) return "from-green-500/10 to-green-600/5";
    if (percentage >= 60) return "from-yellow-500/10 to-yellow-600/5";
    return "from-red-500/10 to-red-600/5";
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 animate-fadeIn flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Compliance Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Monitor and manage regulatory compliance across all departments
            </p>
          </div>

          <Filters data={data} />
        </div>

        <Keymetrics data={data} />

        <Regdeptcards data={data} />

        <Quickactions />
      </div>
      {/* <Detailsdialog data={data} /> */}
    </main>
  );
}
