import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BounceLoader } from "react-spinners";

const Popuploading = ({ open }: { open: boolean }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-gray-800 border-gray-700 flex align-middle justify-center">
        <BounceLoader
          color={"#fff"}
          loading={true}
          size={200}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </DialogContent>
    </Dialog>
  );
};

export default Popuploading;
