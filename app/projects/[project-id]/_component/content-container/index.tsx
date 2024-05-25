import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/types/project-types";
import Chapters from "./chapters";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TranscriptProps {
  chapters: any[];
  project: Project;
  objectUrl?: string;
}

const ContentContainer = ({
  chapters,
  project,
  objectUrl,
}: TranscriptProps) => {
  return (
    <div className="flex flex-col gap-y-4 w-[50%] h-full pl-6 py-6 bg-white">
      <div className="flex flex-col gap-y-4 overflow-y-auto ">
        <Tabs
          defaultValue="chapters"
          className="w-full p-3 flex flex-col items-start overflow-y-auto"
        >
          <div className="flex items-center justify-between py-4 w-full">
            <TabsList>
              <TabsTrigger value="chapters">Chapters</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-x-4 mr-2">
              <SearchInput placeholder="title, content..." />
              <Button size={"icon"}>
                <ArrowDownToLine className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <ScrollArea>
            <TabsContent value="chapters" className="w-full flex-1">
              <Chapters
                project={project}
                chapters={chapters}
                objectUrl={objectUrl}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentContainer;
