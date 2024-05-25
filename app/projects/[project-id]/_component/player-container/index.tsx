import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/types/project-types";
import Transcript from "./transcript";
import Player from "./player";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";

interface PlayerProps {
  project: Project;
  utterances: any[];
  objectUrl?: string;
}

const PlayerContainer = ({ project, utterances, objectUrl }: PlayerProps) => {
  return (
    <div className="flex-1 bg-white flex flex-col gap-y-4 h-full pl-6 py-6">
      <Player project={project} objectUrl={objectUrl} />

      <Tabs
        defaultValue="transcript"
        className="w-full flex-1 flex flex-col items-start overflow-y-auto"
      >
        <div className="flex items-center justify-between py-4 w-full">
          <TabsList>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-x-4">
            <SearchInput placeholder="transcript, speaker..." />
            <Button size={"icon"}>
              <ArrowDownToLine className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea>
          <TabsContent value="transcript">
            <Transcript utterances={utterances} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default PlayerContainer;
