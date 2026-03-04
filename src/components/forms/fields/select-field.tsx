import type { ReactNode } from "react"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFieldContext } from "../form-context"
import { FieldBase, type FieldProps } from "./field-base"

export function SelectField({
  children,
  ...props
}: FieldProps & { children: ReactNode }) {
  const field = useFieldContext<string>()
  const { isTouched, isValid } = field.state.meta
  const isInvalid = isTouched && !isValid

  return (
    <FieldBase {...props}>
      <Select
        onValueChange={(e) => e !== null && field.handleChange(e)}
        value={field.state.value}
      >
        <SelectTrigger
          aria-invalid={isInvalid}
          id={field.name}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FieldBase>
  )
}
