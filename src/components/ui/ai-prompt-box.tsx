import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ArrowUp, Paperclip, Square, Mic } from "lucide-react";

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none",
        className
      )}
      ref={ref}
      rows={1}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

// Tooltip
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-[#C2622A] hover:bg-[#a8501f] text-white",
      ghost: "bg-transparent hover:bg-[#2e1e0e]/40",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      icon: "h-8 w-8 rounded-full",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// PromptInput context
interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});
function usePromptInput() {
  return React.useContext(PromptInputContext);
}

interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled = false }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };
    return (
      <TooltipProvider>
        <PromptInputContext.Provider
          value={{ isLoading, value: value ?? internalValue, setValue: onValueChange ?? handleChange, maxHeight, onSubmit, disabled }}
        >
          <div
            ref={ref}
            className={cn(
              "rounded-3xl border border-border bg-card p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300",
              className
            )}
          >
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  }
);
PromptInput.displayName = "PromptInput";

// Textarea sub-component
interface PromptInputTextareaProps {
  disableAutosize?: boolean;
  placeholder?: string;
}
const PromptInputTextarea: React.FC<PromptInputTextareaProps & React.ComponentProps<typeof Textarea>> = ({
  className, onKeyDown, disableAutosize = false, placeholder, ...props
}) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-base", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

// Actions
const PromptInputActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({ tooltip, children, side = "top", ...props }) => {
  const { disabled } = usePromptInput();
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

// Main PromptInputBox
interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
  const { onSend = () => {}, isLoading = false, placeholder = "Ask Tasterra anything...", className } = props;
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const promptBoxRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      onSend(input, files);
      setInput("");
      setFiles([]);
    }
  };

  const hasContent = input.trim() !== "" || files.length > 0;

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className={cn("w-full", className)}
      disabled={isLoading || isRecording}
      ref={(ref as React.RefObject<HTMLDivElement>) || promptBoxRef}
    >
      <PromptInputTextarea placeholder={placeholder} className="text-base" />

      <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">
        <div className="flex items-center gap-1">
          <PromptInputAction tooltip="Attach image">
            <button
              onClick={() => uploadInputRef.current?.click()}
              className="flex h-8 w-8 text-muted-foreground cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-foreground"
            >
              <Paperclip className="h-4 w-4" />
              <input
                ref={uploadInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFiles([e.target.files[0]]);
                    if (e.target) e.target.value = "";
                  }
                }}
                accept="image/*"
              />
            </button>
          </PromptInputAction>
        </div>

        <PromptInputAction
          tooltip={isLoading ? "Stop" : hasContent ? "Send" : "Voice"}
        >
          <Button
            variant="default"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              !hasContent && !isLoading && "bg-transparent hover:bg-accent text-muted-foreground"
            )}
            onClick={() => {
              if (isLoading) return;
              if (hasContent) handleSubmit();
              else setIsRecording((r) => !r);
            }}
          >
            {isLoading ? (
              <Square className="h-4 w-4 fill-white animate-pulse" />
            ) : hasContent ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </PromptInputAction>
      </PromptInputActions>
    </PromptInput>
  );
});
PromptInputBox.displayName = "PromptInputBox";
