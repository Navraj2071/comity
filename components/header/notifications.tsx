import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";
import useapi from "../api/api";

const Notifications = ({ store }: any) => {
  const api = useapi();
  const notifications = store?.db?.notifications || [];

  useEffect(() => {
    if (notifications.length > 0) {
      document.title = `(${notifications.length}) Comity App`;
    }
  }, [notifications]);

  const readNotification = async (id: string) => {
    api
      .readNotification({ _id: id })
      .then((res) => store?.update("notifications"))
      .catch((err) => console.log(err));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white relative h-8 w-8 p-0 rounded-full"
        >
          <Bell className="h-4 w-4" />
          {notifications?.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-xs flex items-center justify-center p-0">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-50 bg-gray-800 border-gray-100  p-1"
      >
        <DropdownMenuSeparator className="bg-gray-700" />
        {notifications?.length === 0 ? (
          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 text-sm p-2 flex gap-2">
            <Bell className="h-4 w-4" /> No New Notifications
          </DropdownMenuItem>
        ) : (
          notifications?.map((not: any) => (
            <DropdownMenuItem
              className="text-gray-300 hover:bg-gray-700 text-sm p-2 flex gap-2 items-center cursor-pointer"
              key={not._id}
              onClick={() => readNotification(not._id)}
            >
              <Dot severity={not.severity} />
              {not?.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;

const Dot = ({ severity }: any) => {
  const color =
    severity === "high"
      ? "bg-red-500"
      : severity === "medium"
      ? "bg-orange-200"
      : "bg-green-500";

  return <div className={`h-2 w-2 rounded-full ${color}`} />;
};
