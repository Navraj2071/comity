import useStore from "@/lib/store/useStore";
import LoadingPage from "@/app/loading";
import { useEffect, useState } from "react";

const AccessControl = ({ children }: any) => {
  const store = useStore();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(store?.db?.user);
  }, [store?.db?.user]);

  if (!user) return <LoadingPage />;

  if (
    !(
      user?.role === "Super-user" ||
      store?.tools?.getDepartmentNameFromId(user.department) === "Compliance"
    )
  )
    return (
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-2">Page not allowed</h1>
        <p className="text-gray-400">
          This utility is accessible to authorized users only.
        </p>
      </main>
    );

  return <>{children}</>;
};

export default AccessControl;
