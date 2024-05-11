"use client";

import { SERVER_ENDPOINT } from "@/config/server-config";
import { Kind, Status } from "@/types/project-types";
import { Pen, Settings } from "lucide-react";

interface PreviewProps {
  id: string;
  kind: Kind;
  url: string;
  status: Status;
}

const Preview = ({ kind, url, status, id }: PreviewProps) => {
  return (
    <>
      <div className="group relative flex-1 bg-amber-200 w-full h-full overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 right-0 bottom-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40" />

        {kind === Kind.Video && (
          <div className="flex items-center justify-center opacity-100 transition w-full h-full">
            <video className="w-full h-full object-cover" controls={false}>
              <source src={SERVER_ENDPOINT + "/" + url + "#t=5"} />
            </video>
          </div>
        )}

        {status === Status.Pending && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-100 transition gap-y-4">
            <Settings className="w-8 h-8  fill-white group-hover:animate-spin mr-2" />{" "}
            <span className="hidden group-hover:block text-white font-semibold">
              Processing
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Preview;
