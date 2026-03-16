import { Activity, useId } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"

import { useFieldContext } from "../form-context"
import { type FieldBaseProps, useFieldInvalid } from "./field-base"

type CheckboxCardFieldProps = FieldBaseProps & {
  orientation?: "horizontal" | "vertical"
}

export function CheckboxCardField({
  label,
  description,
  disabled,
  orientation = "vertical",
}: CheckboxCardFieldProps) {
  const field = useFieldContext<boolean>()
  const errorId = useId()

  const { errors } = field.state.meta
  const isInvalid = useFieldInvalid()

  return (
    <FieldLabel data-invalid={isInvalid} htmlFor={field.name}>
      <Field orientation={orientation}>
        <FieldContent>
          <FieldTitle aria-invalid={isInvalid}>{label}</FieldTitle>
          <Activity mode={description ? "visible" : "hidden"}>
            <FieldDescription>{description}</FieldDescription>
          </Activity>
        </FieldContent>

        <Checkbox
          aria-describedby={isInvalid ? errorId : undefined}
          aria-invalid={isInvalid}
          checked={field.state.value}
          disabled={disabled}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onCheckedChange={(checked) => field.handleChange(!!checked)}
        />

        <Activity mode={isInvalid ? "visible" : "hidden"}>
          <FieldError errors={errors} id={errorId} />
        </Activity>
      </Field>
    </FieldLabel>
  )
}
