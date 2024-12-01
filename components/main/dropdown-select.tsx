import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUpDown } from "lucide-react";

interface DropdownSelectProps {
    label: string;
    placeholder: string;
    options: { id: number; name: string }[];
    selected: { id: number; name: string }[] | null;
    setSelected: (selected: { id: number; name: string }[] | null) => void;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({ label, placeholder, options, selected, setSelected }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <Label htmlFor={label} className="text-right">
                {label}
            </Label>
            <div className="col-span-3">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selected ? selected[0].name : placeholder}
                            <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                        <Command>
                            <CommandInput placeholder={`Пошук ${placeholder.toLowerCase()}...`} />
                            <CommandList>
                                <CommandEmpty>{`${label} не знайдено.`}</CommandEmpty>
                                <CommandGroup>
                                    {options.map((option) => (
                                        <CommandItem
                                            key={option.id}
                                            value={option.name}
                                            onSelect={() => {
                                                setSelected(option ? [option] : null);
                                                setOpen(false);
                                            }}
                                        >
                                            {option.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default DropdownSelect;
