import { Checkbox } from "@/components/ui/checkbox"
import { useFieldContext } from "../form-context"
import { FieldBase, type FieldProps } from "./field-base"

export function CheckboxField(props: FieldProps) {
  const field = useFieldContext<boolean>()
  const { isTouched, isValid } = field.state.meta
  const isInvalid = isTouched && !isValid

  return (
    <FieldBase {...props} controlFirst horizontal>
      <Checkbox
        aria-invalid={isInvalid}
        checked={field.state.value}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
      />
    </FieldBase>
  )
}
