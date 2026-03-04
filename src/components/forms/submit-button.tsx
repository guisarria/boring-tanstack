import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { useFormContext } from "./form-context"

export function SubmitButton({
  children,
  isPending = false,
}: {
  children: React.ReactNode
  isPending?: boolean
}) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ isSubmitting }) => (
        <Button disabled={isSubmitting || isPending} type="submit">
          <LoadingSwap isLoading={isSubmitting || isPending}>
            {children}
          </LoadingSwap>
        </Button>
      )}
    </form.Subscribe>
  )
}
