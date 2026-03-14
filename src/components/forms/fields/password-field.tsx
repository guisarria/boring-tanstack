import { PasswordInput } from "@/components/ui/password-input"

import { useFieldContext } from "../form-context"
import { FieldBase, type InputFieldProps, useFieldInvalid } from "./field-base"

export function PasswordField(props: InputFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = useFieldInvalid()

  return (
    <FieldBase {...props}>
      <PasswordInput
        aria-invalid={isInvalid}
        disabled={props.disabled}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={props.placeholder}
        value={field.state.value}
      />
    </FieldBase>
  )
}
