import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonIconProps {
  label: string;
  side?: "left" | "top" | "right" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  icon: any;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ButtonIcon({
  label,
  side,
  align,
  sideOffset,
  alignOffset,
  icon: Icon,
  className,
  onClick,
}: ButtonIconProps) {
  return (
    <>
      {label && (
        <Hint
          label={label}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <Button
            size={"icon"}
            variant={"ghost"}
            className={cn(
              "group w-full aspect-square flex items-center justify-center text-muted-foreground hover:text-foreground transition",
              className
            )}
            onClick={onClick}
          >
            <Icon className="w-4 h-4 group-hover:scale-[1.2] transition " />
          </Button>
        </Hint>
      )}

      {!label && (
        <Button
          size={"icon"}
          variant={"ghost"}
          className="group w-full aspect-square flex items-center justify-center text-muted-foreground hover:text-foreground transition"
        >
          <Icon className="w-4 h-4 group-hover:scale-[1.2] transition " />
        </Button>
      )}
    </>
  );
}
