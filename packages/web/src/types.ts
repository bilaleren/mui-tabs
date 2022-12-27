import * as React from 'react'

export type TabValue = string | number | boolean

export type IconPosition = 'top' | 'start' | 'end' | 'bottom'

export type ChangeHandler<Value extends TabValue = any> = (
  value: Value,
  event: React.SyntheticEvent<HTMLButtonElement>
) => void
