"use client";

import { BounceLoader } from "react-spinners";

const Page = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <BounceLoader color="#f4c900" size={100} />
    </div>
  );
};

export default Page;
