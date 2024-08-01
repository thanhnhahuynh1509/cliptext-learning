import { updateProjectCaption } from "@/api/project";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCaptionStyles } from "@/stores/caption-style-store";
import { useProjects } from "@/stores/projects-store";
import { CaptionStyle } from "@/types/caption-style-type";
import { EllipsisVertical, Pen, Trash2 } from "lucide-react";
import React, { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface CaptionStyleSelectionSectionProps {
  captions: CaptionStyle[];
  activeCaption?: CaptionStyle;
  afterSetValueCallback: (caption: CaptionStyle | undefined) => void;
  onCreate?: boolean;
  onCreateClick?: () => void;
}

const CaptionStyleSelectionSection = ({
  captions,
  activeCaption,
  afterSetValueCallback,
  onCreate,
  onCreateClick,
}: CaptionStyleSelectionSectionProps) => {
  const [onEdit, setOnEdit] = useState(false);
  const [name, setName] = useState(activeCaption?.name ?? "");
  const { captionStyles, setCaptionStyles, setActiveCaption } =
    useCaptionStyles();
  const { currentProject } = useProjects();

  const updateCaption = useCallback(() => {
    try {
      if (!name?.trim()) {
        toast.error("Caption name is not empty!");
        return;
      }
      if (!activeCaption) {
        return;
      }
      activeCaption.name = name;
      const updatedCaptions = captions.map((caption) => {
        if (caption.id == activeCaption.id) {
          return activeCaption;
        }
        return caption;
      });
      setCaptionStyles(updatedCaptions);
      afterSetValueCallback(activeCaption);
    } catch (e) {
      console.log(e);
      toast.error(
        "Couldn't update caption name! Please try again or contact supports."
      );
    } finally {
      setOnEdit(false);
    }
  }, [activeCaption, afterSetValueCallback, captions, name, setCaptionStyles]);

  let label = "";
  if (onCreate) {
    label = "Create new caption";
  } else if (onEdit) {
    label = "Update caption name";
  } else {
    label = "Select caption style";
  }

  useEffect(() => {
    if (activeCaption) {
      setName(activeCaption.name);
    }
  }, [activeCaption]);

  return (
    <div className="flex gap-x-8 items-end w-full">
      <div className="flex gap-x-2 items-end flex-1">
        <div className="flex flex-col gap-y-4 flex-1">
          <h4 className="font-bold text-base">{label}</h4>

          {onEdit && (
            <Input
              autoFocus
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  updateCaption();
                }
              }}
            />
          )}

          {!onEdit && !onCreate && (
            <Select
              onValueChange={async (value) => {
                try {
                  const captionId = parseInt(value);
                  setActiveCaption(captionId, captionStyles);
                  if (!currentProject) {
                    return;
                  }
                  await updateProjectCaption(currentProject.id, captionId);
                } catch (e) {
                  console.log(e);
                  toast.error(
                    "Couldn't change the caption style! Please try again or contact support, thanks."
                  );
                }
              }}
              defaultValue={`${activeCaption?.id}` ?? "default"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Caption name" />
              </SelectTrigger>
              <SelectContent>
                {captions?.map((caption) => {
                  return (
                    <SelectItem key={caption.id} value={`${caption.id}`}>
                      {caption.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}

          {onCreate && (
            <Input
              autoFocus
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!activeCaption) {
                  return;
                }
                activeCaption.name = e.target.value;
                afterSetValueCallback(activeCaption);
              }}
            />
          )}
        </div>

        {!onEdit && !onCreate && (
          <DropdownMenu modal>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <EllipsisVertical className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
              <DropdownMenuItem
                className="hover:bg-black/5 transition-all"
                onClick={() => {
                  setOnEdit(true);
                }}
              >
                <Pen className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:bg-black/5 transition-all"
                onClick={() => {
                  alert("hehe");
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {!onEdit && !onCreate && (
        <div className="flex gap-x-4 items-center">
          <Button onClick={onCreateClick}>Add new style</Button>

          {!activeCaption?.isDefault && (
            <Button size={"icon"} variant={"ghost"}>
              <Trash2 className="w-6 h-6" />
            </Button>
          )}
        </div>
      )}

      {onEdit && (
        <div className="flex gap-x-4 items-center">
          <Button onClick={updateCaption}>Update</Button>

          <Button
            variant={"ghost"}
            onClick={() => {
              setName(activeCaption?.name ?? "");
              setOnEdit(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(CaptionStyleSelectionSection);
