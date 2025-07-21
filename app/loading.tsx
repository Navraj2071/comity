"use client";

import { BounceLoader } from "react-spinners";

const Page = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <BounceLoader color="#fff" size={100} />
    </div>
  );
};

export default Page;
