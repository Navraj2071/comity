"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  X,
} from "lucide-react";
import { useState } from "react";

import { useRouter } from "next/navigation";
import useStore from "@/lib/store/useStore";
import { BarLoader } from "react-spinners";
import Checkpointview from "./checkpointview";

export function Header() {
  const store = useStore();
  const user = store?.db?.user || {};
  const checkpoints = store?.db?.checkpoints || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null);
  const router = useRouter();

  const searchResults = checkpoints
    ? checkpoints.filter(
        (checkpoint) =>
          checkpoint?.letterNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          checkpoint?.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleLogout = () => {
    router.push("/login");
  };

  if (!user) {
    return (
      <header
        className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-3 sticky top-0 z-10 h-10"
        id="main-header"
      >
        <div className="flex items-center justify-center ">
          <BarLoader color="rgb(227, 179, 0)" height={4} width={200} />
        </div>
      </header>
    );
  }

  return (
    <header
      className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-3 sticky top-0 z-10"
      id="main-header"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-medium text-white">
            Welcome,{" "}
            <span className="font-semibold">{user?.name?.split(" ")[0]}</span>
          </h2>
          <Badge
            variant="outline"
            className="text-xs font-normal text-gray-400 border-gray-700 px-2 py-0"
          >
            {user?.role} •{" "}
            {store?.tools?.getDepartmentNameFromId(user?.department)}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search by letter/circular number..."
              className="h-8 w-64 rounded-full bg-gray-700/50 border border-gray-700 text-sm pl-8 pr-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            {isFocused && searchTerm && (
              <div className="absolute top-full mt-1 right-0 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <div
                        key={result?._id}
                        className="p-2 hover:bg-gray-700 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedCheckpoint(result);
                          setIsFocused(false);
                          setSearchTerm("");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">
                            {result?.letterNumber}
                          </span>
                          <Badge className="text-xs">
                            {result?.regulatory}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                          {result?.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white relative h-8 w-8 p-0 rounded-full"
          >
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-xs flex items-center justify-center p-0">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-300 hover:text-white h-8 px-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-yellow-600/80 text-white text-xs">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-gray-800 border-gray-700"
            >
              <DropdownMenuLabel className="text-gray-300">
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">
                    {store?.tools?.getDepartmentNameFromId(user?.department)} •{" "}
                    {user?.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 text-sm">
                <User className="mr-2 h-3.5 w-3.5" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 text-sm">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem
                className="text-red-400 hover:bg-gray-700 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Checkpointview
        selectedCheckpoint={selectedCheckpoint}
        setSelectedCheckpoint={setSelectedCheckpoint}
        store={store}
      />
    </header>
  );
}
