import { Input } from "@/components/ui/input"
import { useFieldContext } from "../form-context"
import { FieldBase, type InputFieldProps, useFieldInvalid } from "./field-base"

export function InputField(props: InputFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = useFieldInvalid()

  return (
    <FieldBase {...props}>
      <Input
        aria-invalid={isInvalid}
        autoComplete={props.autoComplete}
        disabled={props.disabled}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={props.placeholder}
        type={props.type}
        value={field.state.value}
      />
    </FieldBase>
  )
}
