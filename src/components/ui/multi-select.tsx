import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";

export interface AnimationConfig {
  badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
  popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
  optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
  duration?: number;
  delay?: number;
}

const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
    badgeAnimation: {
      bounce: "hover:-translate-y-1 hover:scale-110",
      pulse: "hover:animate-pulse",
      wiggle: "hover:animate-wiggle",
      fade: "hover:opacity-80",
      slide: "hover:translate-x-1",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    badgeAnimation: "bounce",
  },
});

interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  style?: { badgeColor?: string; iconColor?: string; gradient?: string };
}

interface MultiSelectGroup {
  heading: string;
  options: MultiSelectOption[];
}

interface MultiSelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "animationConfig">,
    VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOption[] | MultiSelectGroup[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  animationConfig?: AnimationConfig;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  hideSelectAll?: boolean;
  searchable?: boolean;
  emptyIndicator?: React.ReactNode;
  autoSize?: boolean;
  singleLine?: boolean;
  popoverClassName?: string;
  disabled?: boolean;
  responsive?: boolean | { mobile?: { maxCount?: number }; tablet?: { maxCount?: number }; desktop?: { maxCount?: number } };
  minWidth?: string;
  maxWidth?: string;
  deduplicateOptions?: boolean;
  resetOnDefaultValueChange?: boolean;
  closeOnSelect?: boolean;
}

export interface MultiSelectRef {
  reset: () => void;
  getSelectedValues: () => string[];
  setSelectedValues: (values: string[]) => void;
  clear: () => void;
  focus: () => void;
}

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      options, onValueChange, variant, defaultValue = [], placeholder = "Select options",
      animation = 0, animationConfig, maxCount = 3, modalPopover = false, asChild = false,
      className, hideSelectAll = false, searchable = true, emptyIndicator, autoSize = false,
      singleLine = false, popoverClassName, disabled = false, responsive, minWidth, maxWidth,
      deduplicateOptions = false, resetOnDefaultValueChange = true, closeOnSelect = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const prevDefaultValueRef = React.useRef<string[]>(defaultValue);

    const isGroupedOptions = React.useCallback(
      (opts: MultiSelectOption[] | MultiSelectGroup[]): opts is MultiSelectGroup[] =>
        opts.length > 0 && "heading" in opts[0],
      []
    );

    const arraysEqual = React.useCallback((a: string[], b: string[]): boolean => {
      if (a.length !== b.length) return false;
      return [...a].sort().every((val, i) => val === [...b].sort()[i]);
    }, []);

    const getAllOptions = React.useCallback((): MultiSelectOption[] => {
      if (options.length === 0) return [];
      if (isGroupedOptions(options)) return options.flatMap((g) => g.options);
      return options as MultiSelectOption[];
    }, [options, isGroupedOptions]);

    const getOptionByValue = React.useCallback(
      (value: string) => getAllOptions().find((o) => o.value === value),
      [getAllOptions]
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchValue) return options;
      if (isGroupedOptions(options)) {
        return options
          .map((g) => ({ ...g, options: g.options.filter((o) => o.label.toLowerCase().includes(searchValue.toLowerCase())) }))
          .filter((g) => g.options.length > 0);
      }
      return (options as MultiSelectOption[]).filter((o) => o.label.toLowerCase().includes(searchValue.toLowerCase()));
    }, [options, searchValue, searchable, isGroupedOptions]);

    const resetToDefault = React.useCallback(() => {
      setSelectedValues(defaultValue);
      setIsPopoverOpen(false);
      setSearchValue("");
      onValueChange(defaultValue);
    }, [defaultValue, onValueChange]);

    React.useImperativeHandle(ref, () => ({
      reset: resetToDefault,
      getSelectedValues: () => selectedValues,
      setSelectedValues: (values) => { setSelectedValues(values); onValueChange(values); },
      clear: () => { setSelectedValues([]); onValueChange([]); },
      focus: () => buttonRef.current?.focus(),
    }), [resetToDefault, selectedValues, onValueChange]);

    React.useEffect(() => {
      if (!resetOnDefaultValueChange) return;
      if (!arraysEqual(prevDefaultValueRef.current, defaultValue)) {
        if (!arraysEqual(selectedValues, defaultValue)) setSelectedValues(defaultValue);
        prevDefaultValueRef.current = [...defaultValue];
      }
    }, [defaultValue, selectedValues, arraysEqual, resetOnDefaultValueChange]);

    React.useEffect(() => {
      if (!isPopoverOpen) setSearchValue("");
    }, [isPopoverOpen]);

    const toggleOption = (optionValue: string) => {
      if (disabled) return;
      const option = getOptionByValue(optionValue);
      if (option?.disabled) return;
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onValueChange(newValues);
      if (closeOnSelect) setIsPopoverOpen(false);
    };

    const handleClear = () => {
      if (disabled) return;
      setSelectedValues([]);
      onValueChange([]);
    };

    const toggleAll = () => {
      if (disabled) return;
      const allOpts = getAllOptions().filter((o) => !o.disabled);
      if (selectedValues.length === allOpts.length) {
        handleClear();
      } else {
        const allValues = allOpts.map((o) => o.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
      if (closeOnSelect) setIsPopoverOpen(false);
    };

    const getBadgeAnimationClass = () =>
      animationConfig?.badgeAnimation === "none" ? "" : isAnimating ? "animate-bounce" : "";

    const renderOption = (option: MultiSelectOption) => {
      const isSelected = selectedValues.includes(option.value);
      return (
        <CommandItem
          key={option.value}
          onSelect={() => toggleOption(option.value)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={option.disabled}
          className={cn("cursor-pointer", option.disabled && "opacity-50 cursor-not-allowed")}
          disabled={option.disabled}
        >
          <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")} aria-hidden="true">
            <CheckIcon className="h-4 w-4" />
          </div>
          {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          <span>{option.label}</span>
        </CommandItem>
      );
    };

    return (
      <>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
          <PopoverTrigger asChild>
            <button
              ref={buttonRef}
              type="button"
              disabled={disabled}
              role="combobox"
              aria-expanded={isPopoverOpen}
              className={cn(
                "flex p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-background hover:bg-accent/20 transition-colors [&_svg]:pointer-events-auto",
                autoSize ? "w-auto" : "w-full",
                disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                className
              )}
              style={{ minWidth: minWidth || "200px", maxWidth: maxWidth || "100%", width: autoSize ? "auto" : "100%" }}
            >
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div className={cn("flex items-center gap-1", singleLine ? "overflow-x-auto" : "flex-wrap")}>
                    {selectedValues.slice(0, maxCount).map((value) => {
                      const option = getOptionByValue(value);
                      if (!option) return null;
                      return (
                        <Badge key={value} className={cn(getBadgeAnimationClass(), multiSelectVariants({ variant }))}>
                          {option.icon && <option.icon className="h-4 w-4 mr-2" />}
                          <span>{option.label}</span>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); toggleOption(value); }}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); toggleOption(value); } }}
                            aria-label={`Remove ${option.label}`}
                            className="ml-2 h-4 w-4 cursor-pointer hover:bg-white/20 rounded-sm p-0.5"
                          >
                            <XCircle className="h-3 w-3" />
                          </div>
                        </Badge>
                      );
                    })}
                    {selectedValues.length > maxCount && (
                      <Badge className={cn("bg-transparent text-foreground border-foreground/1 hover:bg-transparent", multiSelectVariants({ variant }))}>
                        {`+ ${selectedValues.length - maxCount} more`}
                        <XCircle className="ml-2 h-4 w-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedValues(selectedValues.slice(0, maxCount)); onValueChange(selectedValues.slice(0, maxCount)); }} />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); handleClear(); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); handleClear(); } }} aria-label="Clear all" className="flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground rounded-sm">
                      <XIcon className="h-4 w-4" />
                    </div>
                    <Separator orientation="vertical" className="flex min-h-6 h-full" />
                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                  <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className={cn("w-auto p-0 min-w-[300px]", popoverClassName)} align="start" onEscapeKeyDown={() => setIsPopoverOpen(false)}>
            <Command>
              {searchable && (
                <CommandInput
                  placeholder="Search options..."
                  onKeyDown={(e) => { if (e.key === "Enter") setIsPopoverOpen(true); else if (e.key === "Backspace" && !e.currentTarget.value) { const n = [...selectedValues]; n.pop(); setSelectedValues(n); onValueChange(n); } }}
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
              )}
              <CommandList className="max-h-[40vh] overflow-y-auto">
                <CommandEmpty>{emptyIndicator || "No results found."}</CommandEmpty>
                {!hideSelectAll && !searchValue && (
                  <CommandGroup>
                    <CommandItem key="all" onSelect={toggleAll} role="option" className="cursor-pointer">
                      <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", selectedValues.length === getAllOptions().filter((o) => !o.disabled).length ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")} aria-hidden="true">
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span>(Select All)</span>
                    </CommandItem>
                  </CommandGroup>
                )}
                {isGroupedOptions(filteredOptions) ? (
                  filteredOptions.map((group) => (
                    <CommandGroup key={group.heading} heading={group.heading}>
                      {group.options.map(renderOption)}
                    </CommandGroup>
                  ))
                ) : (
                  <CommandGroup>{(filteredOptions as MultiSelectOption[]).map(renderOption)}</CommandGroup>
                )}
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between">
                    {selectedValues.length > 0 && (
                      <>
                        <CommandItem onSelect={handleClear} className="flex-1 justify-center cursor-pointer">Clear</CommandItem>
                        <Separator orientation="vertical" className="flex min-h-6 h-full" />
                      </>
                    )}
                    <CommandItem onSelect={() => setIsPopoverOpen(false)} className="flex-1 justify-center cursor-pointer max-w-full">Close</CommandItem>
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
          {animation > 0 && selectedValues.length > 0 && (
            <WandSparkles
              className={cn("cursor-pointer my-2 text-foreground bg-background w-3 h-3", isAnimating ? "" : "text-muted-foreground")}
              onClick={() => setIsAnimating(!isAnimating)}
            />
          )}
        </Popover>
      </>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
export type { MultiSelectOption, MultiSelectGroup, MultiSelectProps };
