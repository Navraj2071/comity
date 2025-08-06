import { BarLoader } from "react-spinners";

const Loader = ({ collapsed }: any) => {
  const width = collapsed ? 20 : 150;
  return (
    <div className="mb-5 flex flex-col gap-10 flex-1 p-4 space-y-2">
      <BarLoader color="rgb(228, 179, 0)" height={30} width={width} />
      <BarLoader color="rgb(228, 179, 0)" height={30} width={width} />
      <BarLoader color="rgb(228, 179, 0)" height={30} width={width} />
      <BarLoader color="rgb(228, 179, 0)" height={30} width={width} />
      <BarLoader color="rgb(228, 179, 0)" height={30} width={width} />
    </div>
  );
};

export default Loader;
