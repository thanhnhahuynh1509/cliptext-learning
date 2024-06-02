import { useTranscript } from "@/stores/transcript-store";
import { Clapperboard } from "lucide-react";
import React, { useCallback } from "react";

import EditItem from "./edit-item";
import { useProjects } from "@/stores/projects-store";
import { Edit } from "@/types/transcript-types";
import { updateEdit } from "@/api/project";

interface EditsProps {
  currentEdit?: Edit;
  setCurrentEdit: (edit?: Edit) => void;
}

const Edits = ({ currentEdit, setCurrentEdit }: EditsProps) => {
  const { edits, setEdits } = useTranscript();
  const { currentProject } = useProjects();

  const onDelete = useCallback(
    (id: string) => {
      const updatedEdit = edits?.filter((edit) => edit.id !== id);
      setEdits(updatedEdit);
      updateEdit(currentProject?.id!, updatedEdit || []);
    },
    [currentProject?.id, edits, setEdits]
  );

  return (
    <>
      {(!edits || edits?.length == 0) && (
        <div className="w-full flex flex-col items-center justify-center">
          <Clapperboard className="mt-6 w-12 h-12 text-muted-foreground" />
          <h3 className="mt-6 font-medium text-lg text-muted-foreground">
            You have no edits
          </h3>
          <p className="font-normal text-sm text-muted-foreground mt-2">
            Try to select a transcript and create an edit!
          </p>
        </div>
      )}

      {edits && edits.length > 0 && (
        <div className="w-full h-full overflow-hidden flex flex-col gap-y-8 pt-6">
          {edits.map((edit) => {
            const active = currentEdit?.id == edit.id;
            return (
              <EditItem
                key={edit.id}
                edit={edit}
                onDelete={onDelete}
                onClick={(edit) => {
                  setCurrentEdit(edit);
                }}
                active={active}
              />
            );
          })}

          <div className="h-2"></div>
        </div>
      )}
    </>
  );
};

export default Edits;
