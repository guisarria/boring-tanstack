import { Activity, type ReactNode } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { useFieldContext } from "../form-context"

export type FieldProps = {
  label: string
  description?: string
  type?: React.ComponentProps<"input">["type"]
  placeholder?: React.ComponentProps<"input">["placeholder"]
  autoComplete?: React.ComponentProps<"input">["autoComplete"]
}

type FieldBaseProps = FieldProps & {
  children: ReactNode
  horizontal?: boolean
  controlFirst?: boolean
}

export function FieldBase({
  children,
  label,
  description,
  controlFirst,
  horizontal,
}: FieldBaseProps) {
  const field = useFieldContext()
  const { isTouched, isValid, errors } = field.state.meta
  const isInvalid = isTouched && !isValid

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Activity mode={description ? "visible" : "hidden"}>
              <FieldDescription>{description}</FieldDescription>
            </Activity>
            <Activity mode={isInvalid ? "visible" : "hidden"}>
              <FieldError errors={errors} />
            </Activity>
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Activity mode={description ? "visible" : "hidden"}>
              <FieldDescription>{description}</FieldDescription>
            </Activity>
          </FieldContent>
          {children}
          <Activity mode={isInvalid ? "visible" : "hidden"}>
            <FieldError errors={errors} />
          </Activity>
        </>
      )}
    </Field>
  )
}
