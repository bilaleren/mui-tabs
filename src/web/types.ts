import type * as React from 'react'
import type { ClassValue } from 'clsx'

export type TabValue = string | number | boolean

export type TabsVariant = 'scrollable' | 'standard' | 'fullWidth'

export type IconPosition = 'top' | 'start' | 'end' | 'bottom'

export type TabsOrientation = 'horizontal' | 'vertical'

export type ClassesWithClassValue<Classes extends object> = {
  [P in keyof Classes]?: ClassValue
}

export type ChangeHandler<Value extends TabValue = any> = (
  value: Value,
  event: React.SyntheticEvent<HTMLButtonElement>
) => void
