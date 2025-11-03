"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"

export type Option = { label: string; value: string }

export function MultiSelect({
  options,
  values,
  onChange,
  placeholder = "Select options",
  className,
}: {
  options: Option[]
  values: string[]
  onChange: (vals: string[]) => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  const safeValues = values || []

  const toggle = (val: string) => {
    onChange(safeValues.includes(val) ? safeValues.filter((v) => v !== val) : [...safeValues, val])
  }

  const clear = () => onChange([])

  const selected = options.filter((o) => safeValues.includes(o.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" role="combobox" variant="outline" className={cn("w-full justify-between", className)}>
          <div className="flex flex-wrap items-center gap-1">
            {selected.length ? (
              selected.map((s) => (
                <Badge key={s.value} variant="secondary">
                  {s.label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command className="max-h-60 overflow-auto">
          <div className="flex items-center justify-between gap-2 p-2">
            <CommandInput placeholder="Search..." />
            {safeValues.length > 0 && (
              <Button variant="ghost" size="icon" onClick={clear} title="Clear">
                <X className="size-4" />
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const checked = safeValues.includes(o.value)
                return (
                  <CommandItem key={o.value} onSelect={() => toggle(o.value)} className="flex items-center gap-2">
                    <Checkbox checked={checked} onCheckedChange={() => toggle(o.value)} />
                    <span className="flex-1">{o.label}</span>
                    {checked ? <Check className="size-4 text-primary" /> : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MultiSelect
