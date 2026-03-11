import { Textarea } from "@/components/ui/textarea"
import { useFieldContext } from "../form-context"
import { FieldBase, type InputFieldProps, useFieldInvalid } from "./field-base"

export function TextareaField(props: InputFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = useFieldInvalid()

  return (
    <FieldBase {...props}>
      <Textarea
        aria-invalid={isInvalid}
        autoComplete={props.autoComplete}
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
