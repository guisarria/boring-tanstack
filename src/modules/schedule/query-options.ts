import { listScheduleEvents } from "./schedule-functions"
import { scheduleEventsResponseSchema } from "./validation"

const SCHEDULE_STALE_TIME = 30_000

export const scheduleQueryKeys = {
  all: ["schedule"] as const,
  list: () => ["schedule", "events"] as const,
}

export function scheduleEventsQueryOptions() {
  return {
    queryKey: scheduleQueryKeys.list(),
    queryFn: async ({ signal }: { signal: AbortSignal }) =>
      scheduleEventsResponseSchema.parse(await listScheduleEvents({ signal })),
    staleTime: SCHEDULE_STALE_TIME,
    refetchOnWindowFocus: true,
  }
}
