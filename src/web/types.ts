import type * as React from 'react'

export type TabValue = string | number | boolean

export type TabsVariant = 'scrollable' | 'standard' | 'fullWidth'

export type IconPosition = 'top' | 'start' | 'end' | 'bottom'

export type TabsOrientation = 'horizontal' | 'vertical'

export type ChangeHandler<Value extends TabValue = any> = (
  value: Value,
  event: React.SyntheticEvent<HTMLButtonElement>
) => void
