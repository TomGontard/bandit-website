// src/styled.d.ts
/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
import 'styled-components'
import type { Theme as ThemeType } from './utils/theme'

declare module 'styled-components' {
  // this makes `props.theme` carry your ThemeType everywhere
  export interface DefaultTheme extends ThemeType {}
}
