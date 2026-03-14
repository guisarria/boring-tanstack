import { createFormHook, createFormHookContexts } from "@tanstack/react-form"

import { CheckboxCardField } from "./fields/checkbox-card-field"
import { CheckboxField } from "./fields/checkbox-field"
import { InputField } from "./fields/input-field"
import { PasswordField } from "./fields/password-field"
import { SelectField } from "./fields/select-field"
import { TextareaField } from "./fields/textarea-field"
import { SubmitButton } from "./submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    PasswordField,
    CheckboxCardField,
    TextareaField,
    CheckboxField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
})
