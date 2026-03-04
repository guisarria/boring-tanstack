import { PasswordInput } from "@/components/ui/password-input"
import { useFieldContext } from "../form-context"
import { FieldBase, type FieldProps } from "./field-base"

export function PasswordField(props: FieldProps) {
  const field = useFieldContext<string>()
  const { isTouched, isValid } = field.state.meta
  const isInvalid = isTouched && !isValid

  return (
    <FieldBase {...props}>
      <PasswordInput
        aria-invalid={isInvalid}
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
