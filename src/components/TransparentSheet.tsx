import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "./ui/utils";

function TransparentSheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

const TransparentSheetTrigger = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger>
>(({ ...props }, ref) => (
  <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />
));
TransparentSheetTrigger.displayName = SheetPrimitive.Trigger.displayName;

function TransparentSheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

// 투명한 오버레이 - 클릭으로 닫히지 않도록 수정
const TransparentSheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, onClick, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-transparent",
      className,
    )}
    onClick={(e) => {
      // 오버레이 클릭으로 모달이 닫히는 것을 방지
      e.preventDefault();
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    {...props}
  />
));
TransparentSheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const TransparentSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
    showClose?: boolean;
  }
>(({ className, children, side = "bottom", showClose = false, ...props }, ref) => (
  <TransparentSheetPortal>
    <TransparentSheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      data-slot="sheet-content"
      className={cn(
        "bg-black/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
        side === "bottom" &&
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t border-white/20",
        className,
      )}
      onPointerDownOutside={(e) => {
        // 외부 클릭으로 모달이 닫히는 것을 방지
        e.preventDefault();
      }}
      onEscapeKeyDown={(e) => {
        // ESC 키로 모달이 닫히는 것을 방지 (필요시 활성화)
        e.preventDefault();
      }}
      {...props}
    >
      {children}
      {showClose && (
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4 text-white" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </TransparentSheetPortal>
));
TransparentSheetContent.displayName = SheetPrimitive.Content.displayName;

function TransparentSheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

const TransparentSheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn("text-foreground font-semibold", className)}
    {...props}
  />
));
TransparentSheetTitle.displayName = SheetPrimitive.Title.displayName;

const TransparentSheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
TransparentSheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  TransparentSheet,
  TransparentSheetTrigger,
  TransparentSheetContent,
  TransparentSheetHeader,
  TransparentSheetTitle,
  TransparentSheetDescription,
};