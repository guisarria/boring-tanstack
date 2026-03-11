import { Activity, type ReactNode } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { useFieldContext } from "../form-context"

export function useFieldInvalid() {
  const field = useFieldContext()
  const { isTouched, isValid } = field.state.meta
  return isTouched && !isValid
}

export type FieldBaseProps = {
  label: string
  description?: string
  disabled?: boolean
}

export type InputFieldProps = FieldBaseProps & {
  type?: React.ComponentProps<"input">["type"]
  placeholder?: React.ComponentProps<"input">["placeholder"]
  autoComplete?: React.ComponentProps<"input">["autoComplete"]
}

type FieldBaseInternalProps = FieldBaseProps & {
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
}: FieldBaseInternalProps) {
  const field = useFieldContext()
  const { errors } = field.state.meta
  const isInvalid = useFieldInvalid()

  return (
    <Field
      className=""
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
