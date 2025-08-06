import { BarLoader } from "react-spinners";
const Loader = () => {
  return (
    <div className="mb-5 flex gap-10">
      <BarLoader color="rgb(33, 42, 57)" height={150} width={200} />
      <BarLoader color="rgb(33, 42, 57)" height={150} width={200} />
      <BarLoader color="rgb(33, 42, 57)" height={150} width={200} />
    </div>
  );
};

export default Loader;
