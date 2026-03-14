import { Checkbox } from "@/components/ui/checkbox"

import { useFieldContext } from "../form-context"
import { FieldBase, type FieldBaseProps, useFieldInvalid } from "./field-base"

export function CheckboxField(props: FieldBaseProps) {
  const field = useFieldContext<boolean>()
  const isInvalid = useFieldInvalid()

  return (
    <FieldBase {...props} controlFirst horizontal>
      <Checkbox
        aria-invalid={isInvalid}
        checked={field.state.value}
        disabled={props.disabled}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
      />
    </FieldBase>
  )
}
