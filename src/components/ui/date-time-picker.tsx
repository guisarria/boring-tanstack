import { format, parse } from "date-fns"
import { CalendarIcon, Clock2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DateTimePickerProps = {
  id: string
  label: string
  value: string
  allDay: boolean
  onChange: (value: string) => void
}

export function DateTimePicker({
  id,
  label,
  value,
  allDay,
  onChange,
}: DateTimePickerProps) {
  function handleDateSelect(selectedDate: Date | undefined) {
    if (!selectedDate) return

    if (allDay) {
      onChange(format(selectedDate, "yyyy-MM-dd"))
    } else {
      const currentTime = parseTime(value)
      const newDate = new Date(selectedDate)
      newDate.setHours(currentTime.hours, currentTime.minutes, 0, 0)
      onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"))
    }
  }

  function handleTimeChange(timeValue: string, type: "hours" | "minutes") {
    const currentTime = parseTime(value)
    const parsedValue = parseInt(timeValue, 10)

    if (isNaN(parsedValue)) return

    const newHours = type === "hours" ? parsedValue : currentTime.hours
    const newMinutes = type === "minutes" ? parsedValue : currentTime.minutes

    const currentDate = parseDate(value, allDay)
    currentDate.setHours(newHours, newMinutes, 0, 0)
    onChange(format(currentDate, "yyyy-MM-dd'T'HH:mm"))
  }

  const currentDate = parseDate(value, allDay)
  const currentTime = parseTime(value)

  const displayValue = allDay
    ? format(currentDate, "MMM d, yyyy")
    : format(currentDate, "MMM d, yyyy") +
      " " +
      String(currentTime.hours).padStart(2, "0") +
      ":" +
      String(currentTime.minutes).padStart(2, "0")

  return (
    <div className="space-y-2">
      <label
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor={id}
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={id}
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
              )}
            />
          }
        >
          <CalendarIcon className="mr-2 size-4" />
          {value ? displayValue : <span>Pick a date</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            className="border-b p-3"
          />
          {!allDay && (
            <div className="border-t bg-card p-3">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor={`${id}-time`}>Time</FieldLabel>
                  <div className="flex gap-2">
                    <InputGroup>
                      <InputGroupInput
                        id={`${id}-hours`}
                        type="number"
                        min="0"
                        max="23"
                        value={String(currentTime.hours).padStart(2, "0")}
                        onChange={(e) =>
                          handleTimeChange(e.target.value, "hours")
                        }
                        className="appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                      />
                      <InputGroupAddon>
                        <Clock2Icon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                    <span className="flex items-center text-muted-foreground">
                      :
                    </span>
                    <InputGroup>
                      <InputGroupInput
                        id={`${id}-minutes`}
                        type="number"
                        min="0"
                        max="59"
                        value={String(currentTime.minutes).padStart(2, "0")}
                        onChange={(e) =>
                          handleTimeChange(e.target.value, "minutes")
                        }
                        className="appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                      />
                    </InputGroup>
                  </div>
                </Field>
              </FieldGroup>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function parseDate(value: string, allDay: boolean): Date {
  if (allDay) {
    return parse(value, "yyyy-MM-dd", new Date())
  }
  return parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
}

function parseTime(value: string): { hours: number; minutes: number } {
  const date = parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  }
}
