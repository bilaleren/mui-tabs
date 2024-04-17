import { Platform, Dimensions } from 'react-native'
import type { Layout } from './types'

export const IS_ANDROID = Platform.OS === 'android'

export const WINDOW_DIM = Dimensions.get('window')

export const INITIAL_LAYOUT: Layout = {
  width: WINDOW_DIM.width,
  height: WINDOW_DIM.height
}

export const TAB_BAR_HEIGHT = 48
