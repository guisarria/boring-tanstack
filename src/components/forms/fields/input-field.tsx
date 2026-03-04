import { Input } from "@/components/ui/input"
import { useFieldContext } from "../form-context"
import { FieldBase, type FieldProps } from "./field-base"

export function InputField(props: FieldProps) {
  const field = useFieldContext<string>()
  const { isTouched, isValid } = field.state.meta
  const isInvalid = isTouched && !isValid

  return (
    <FieldBase {...props}>
      <Input
        aria-invalid={isInvalid}
        autoComplete={props.autoComplete}
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
