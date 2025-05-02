// src/styled.d.ts
import 'styled-components'
import type { Theme as ThemeType } from './utils/theme'

declare module 'styled-components' {
  // this makes `props.theme` carry your ThemeType everywhere
  export interface DefaultTheme extends ThemeType {}
}
