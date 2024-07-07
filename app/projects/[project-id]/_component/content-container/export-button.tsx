import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportChaptersToDocx,
  exportEditToDocx,
  exportEditToMP3,
  exportEditToMP4,
} from "@/exports/exporter";
import { useProjects } from "@/stores/projects-store";
import { useTranscript } from "@/stores/transcript-store";
import { Kind } from "@/types/project-types";
import {
  ArrowDownToLine,
  FileType,
  Film,
  Headphones,
  LoaderCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ExportButtonProps {
  currentTab: string;
}

const ExportButton = ({ currentTab }: ExportButtonProps) => {
  const { edits, chapters } = useTranscript();
  const { currentProject } = useProjects();
  const [onExportMP4, setOnExportMP4] = useState(false);
  const [onExportMP3, setOnExportMP3] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"}>
          <ArrowDownToLine className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-[180px]">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            if (currentTab === "edits") {
              exportEditToDocx(edits ?? []);
            } else {
              exportChaptersToDocx(chapters ?? []);
            }
          }}
        >
          <FileType className="w-5 h-5 text-muted-foreground mr-3" />
          Word
          <DropdownMenuShortcut className="text-[10px] text-muted-foreground">
            .docx
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {currentTab === "edits" && (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={onExportMP3}
              onClick={async () => {
                setOnExportMP3(true);
                toast.info("Exporting your audio edits...");
                try {
                  await exportEditToMP3(
                    currentProject?.id!,
                    currentProject?.url!,
                    currentProject?.name!
                  );
                  toast.success("Exported your audio edits successfully!");
                } catch (e) {
                  toast.error(
                    "Couldn't export your audio edits! Please try again or contact support."
                  );
                } finally {
                  setOnExportMP3(false);
                }
              }}
            >
              {!onExportMP3 && (
                <Headphones className="w-5 h-5 text-muted-foreground mr-3" />
              )}
              {onExportMP3 && (
                <LoaderCircle className="w-5 h-5 text-muted-foreground mr-3 animate-spin" />
              )}
              Audio
              <DropdownMenuShortcut className="text-[10px] text-muted-foreground">
                .mp3
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {currentProject?.kind === Kind.Video && (
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={onExportMP4}
                onClick={async () => {
                  setOnExportMP4(true);
                  toast.info("Exporting your edits...");
                  try {
                    await exportEditToMP4(
                      currentProject?.id!,
                      currentProject?.url!,
                      currentProject?.name!
                    );
                    toast.success("Exported your video edits successfully!");
                  } catch (e) {
                    toast.error(
                      "Couldn't export your video edits! Please try again or contact support."
                    );
                  } finally {
                    setOnExportMP4(false);
                  }
                }}
              >
                {!onExportMP4 && (
                  <Film className="w-5 h-5 text-muted-foreground mr-3" />
                )}
                {onExportMP4 && (
                  <LoaderCircle className="w-5 h-5 text-muted-foreground mr-3 animate-spin" />
                )}
                Video
                <DropdownMenuShortcut className="text-[10px] text-muted-foreground">
                  .mp4
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
