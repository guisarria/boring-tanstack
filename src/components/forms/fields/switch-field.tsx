import { Switch } from "@/components/ui/switch"

import { useFieldContext } from "../form-context"
import { FieldBase, type FieldBaseProps, useFieldInvalid } from "./field-base"

export function SwitchField(props: FieldBaseProps) {
  const field = useFieldContext<boolean>()
  const isInvalid = useFieldInvalid()

  return (
    <FieldBase {...props} controlFirst horizontal>
      <Switch
        aria-invalid={isInvalid}
        checked={field.state.value}
        disabled={props.disabled}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
      />
    </FieldBase>
  )
}
