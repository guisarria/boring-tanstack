import type { ReactNode } from "react"

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useFieldContext } from "../form-context"
import { FieldBase, type FieldBaseProps, useFieldInvalid } from "./field-base"

type SelectFieldProps = FieldBaseProps & {
  placeholder?: string
  children: ReactNode
}

export function SelectField({ children, ...props }: SelectFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = useFieldInvalid()

  return (
    <FieldBase {...props}>
      <Select
        disabled={props.disabled}
        onValueChange={(e) => e !== null && field.handleChange(e)}
        value={field.state.value}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>

        <SelectContent>{children}</SelectContent>
      </Select>
    </FieldBase>
  )
}
