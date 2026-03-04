import { createServerOnlyFn } from "@tanstack/react-start"
import { err, ok, type Result } from "neverthrow"
import {
  type DalError,
  dalConflict,
  dalDatabaseError,
  dalNotFound,
} from "./errors"
import { type AsyncResult, fromPromise } from "./result"

type LookupDescriptor = {
  key?: string
  value?: unknown
}

export function createDal<TEntity extends string>(entity: TEntity) {
  // Guard DAL execution from accidental client calls.
  const assertServerOnly = createServerOnlyFn(() => undefined)

  return {
    run<TValue>(
      operation: string,
      executor: () => Promise<TValue>
    ): AsyncResult<TValue, DalError<TEntity>> {
      assertServerOnly()

      return fromPromise(executor(), (cause) =>
        dalDatabaseError(entity, operation, cause)
      )
    },

    requireFound<TValue>(
      value: TValue | null | undefined,
      lookup?: LookupDescriptor
    ): Result<TValue, DalError<TEntity>> {
      if (value === null || value === undefined) {
        return err(dalNotFound(entity, lookup))
      }

      return ok(value)
    },

    conflict(message: string, reason?: string): DalError<TEntity> {
      return dalConflict(entity, message, reason)
    },

    notFound(lookup?: LookupDescriptor): DalError<TEntity> {
      return dalNotFound(entity, lookup)
    },
  }
}
