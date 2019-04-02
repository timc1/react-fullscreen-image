export type ImageGroupProps = {
  transitionMs?: number
  children: React.ReactNode
}

export type ImageGroupStateTypes = {
  currentFocusedImageIndex: number
  isImageGroupExpanded: boolean
  shouldAnimate: boolean
}

export type ImageGroupActionTypes = {
  type: string
  payload?: any
}

export type ImageProps = {
  src: string
  alt: string
  style?: object
  [k: string]: any
}

declare module 'react-fullscreen-image' {
  export function ImageGroup(props: ImageGroupProps): any
  export function Image(props: ImageProps): any
}
