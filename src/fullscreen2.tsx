import React from 'react'
import './fullscreen.css'

// Type definitions
// ================
type ImageGroupState = {
  currentFocusedImageIndex: number | null
  hasAnimatedZoomAlready: boolean
}

function reducer(
  state: ImageGroupState,
  action: {
    type: string
    payload?: any
  }
): ImageGroupState {
  switch (action.type) {
    case ImageGroup.actions.toggleExpandImage:
      return {
        ...state,
        hasAnimatedZoomAlready: true,
        currentFocusedImageIndex: action.payload.index,
      }
    case ImageGroup.actions.toggleExpandImageAnimate:
      return {
        ...state,
        currentFocusedImageIndex: action.payload.index,
      }
    case ImageGroup.actions.toggleCloseImageAnimate:
      return {
        ...state,
        currentFocusedImageIndex: null,
        hasAnimatedZoomAlready: false,
      }
    default:
      throw new Error(`No action type of "${action.type}" found.`)
  }
}

export function ImageGroup({ children }: { children: React.ReactNode }): any {
  const [state, dispatch] = React.useReducer(reducer, {
    currentFocusedImageIndex: null,
    hasAnimatedZoomAlready: false,
  })

  console.log('state', state)

  /**
   * Returns the updated children with props passed to all nested <Image />
   * and the number of <Image /> components nested.
   */
  const { updatedChildren, count } = mapPropsToChildren(
    children,
    (child: React.ReactNode, index: number) => {
      // @ts-ignore
      return React.cloneElement(child, {
        'data-fullscreen-id': index,
        isFocused: state.currentFocusedImageIndex === index,
        hasAnimatedZoomAlready: state.hasAnimatedZoomAlready,
        isFullScreenMode: state.currentFocusedImageIndex !== null,
        onClick: () => {
          if (index === state.currentFocusedImageIndex) {
            dispatch({
              type: ImageGroup.actions.toggleCloseImageAnimate,
            })
          } else {
            dispatch({
              type:
                state.currentFocusedImageIndex !== null
                  ? ImageGroup.actions.toggleExpandImage
                  : ImageGroup.actions.toggleExpandImageAnimate,
              payload: {
                index,
              },
            })
          }
        },
      })
    }
  )

  return (
    <div
      className={`fullscreen-group${
        state.currentFocusedImageIndex !== null ? ' is-showing' : ''
      }`}
      style={{
        transition: `opacity 400ms ease 50ms`,
      }}
    >
      {updatedChildren}
    </div>
  )
}

export function Image({
  src,
  alt,
  ...props
}: {
  src: string
  alt: string
}): any {
  const {
    // @ts-ignore
    onClick,
    // @ts-ignore
    isFocused,
    // @ts-ignore
    hasAnimatedZoomAlready,
    // @ts-ignore
    isFullScreenMode,
    ...rest
  } = props
  const isCurrentlyFocused = React.useRef(false)

  const container = React.useRef<HTMLDivElement | null>(null)

  const initialRender = React.useRef(false)
  React.useEffect(() => {
    if (!initialRender.current) {
      initialRender.current = true
      return
    }

    if (isFocused && container.current) {
      isCurrentlyFocused.current = true
      if (hasAnimatedZoomAlready) {
        // Immediately show
        toggle('open', container.current, 0)
      } else {
        // Animate in
        toggle('open', container.current, 400)
      }
    } else if (isCurrentlyFocused.current && container.current) {
      if (hasAnimatedZoomAlready) {
        // Immediately hide
        toggle('close', container.current, 0)
      } else {
        // Animate out
        console.log('animate out')
        toggle('close', container.current, 400)
      }

      isCurrentlyFocused.current = false
    }
  }, [isFocused, hasAnimatedZoomAlready])

  return (
    <div ref={container} className="fullscreen-container" {...rest}>
      <button
        tabIndex={isFullScreenMode && !isFocused ? -1 : 0}
        className={`fullscreen-btn${
          isFocused ? ' fullscreen-btn--focused' : ''
        }`}
        onClick={onClick}
      >
        <div className="fullscreen-img-container fullscreen-img--medium">
          <img src={src} alt={alt} />
        </div>
        <div
          data-image-large=""
          className="fullscreen-img-container fullscreen-img--large"
        >
          <img src={src} alt={alt} />
        </div>
      </button>
    </div>
  )
}

function toggle(
  type: 'open' | 'close',
  el: HTMLDivElement,
  transitionMs: number = 400
) {
  const image = el.querySelector('[data-image-large]')

  if (type === 'open') {
    // @ts-ignore
    const { top, left, width, height } = image.getBoundingClientRect()
    const { innerHeight, innerWidth } = window
    // 1. Should we scale based on the viewport height or width?
    //    We need to scale based on the smaller of the two:
    //    If viewport width is smaller than height, we'll scale the image's width.
    //    If viewport height is smaller than width, we'll scale the image's height.
    const direction = innerHeight > innerWidth ? 'width' : 'height'

    const baseDimension = direction === 'width' ? innerWidth : innerHeight
    const imageDimension = direction === 'width' ? width : height
    const scale = baseDimension / imageDimension
    let translateY: number = 0
    let translateX: number = 0

    if (direction === 'width') {
    } else {
      const scaledImageSize = width * scale
      translateY = (top / scale) * -1
      console.log('translateY', translateY, 'top', top, 'height', height)
      // Position of scaled image to be centered horizontally in the viewport.
      const leftOfWhereScaledImageNeedsToBe =
        innerWidth / 2 - scaledImageSize / 2
      const leftOfScaledImage = left - (scaledImageSize - width) / 2
      translateX = (leftOfWhereScaledImageNeedsToBe - leftOfScaledImage) / scale
    }

    // @ts-ignore
    image.style.opacity = '1'
    // @ts-ignore
    image.style.visibility = 'initial'
    // @ts-ignore
    image.style.zIndex = 9
    // @ts-ignore
    image.style.transform = `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`
    // @ts-ignore
    image.style.transformOrigin = '50% 0'
    // @ts-ignore
    image.style.transition = `transform ${transitionMs}ms ease, opacity ${transitionMs}ms ease`
  } else {
    // @ts-ignore
    image.style.opacity = '0'
    // @ts-ignore
    image.style.transform = `scale(1) translate3d(0, 0, 0)`
    // @ts-ignore
    image.style.transformOrigin = '50% 0'
    // @ts-ignore
    image.style.transition = `transform ${transitionMs}ms ease, opacity ${transitionMs}ms ease ${transitionMs}ms`

    if (transitionMs === 0) {
      // @ts-ignore
      image.style.visibility = 'hidden'
      // @ts-ignore
      image.style.zIndex = '-1'
    } else {
      setTimeout(() => {
        // @ts-ignore
        image.style.visibility = 'hidden'
        // @ts-ignore
        image.style.zIndex = '-1'
      }, transitionMs)
    }
  }
}

function mapPropsToChildren(
  children: React.ReactNode,
  fn: (child: React.ReactNode, index: number) => React.ReactNode
): {
  updatedChildren: React.ReactNode
  count: number
} {
  let count = 0

  function recursiveMap(children: React.ReactNode): React.ReactNode {
    return React.Children.map(children, child => {
      // @ts-ignore
      if (child.type.displayName === Image.displayName) {
        child = fn(child, count)
        count++
        return child
      }

      if (!React.isValidElement(child)) {
        return child
      }

      // @ts-ignore
      if (child.props.children) {
        child = React.cloneElement(child, {
          // @ts-ignore
          children: recursiveMap(child.props.children),
        })
      }

      return child
    })
  }

  const updatedChildren = recursiveMap(children)

  return {
    updatedChildren,
    count,
  }
}

ImageGroup.actions = {
  toggleExpandImageAnimate: 'TOGGLE_EXPAND_IMAGE_ANIMATE',
  toggleExpandImage: 'TOGGLE_EXPAND_IMAGE',
  toggleCloseImageAnimate: 'TOGGLE_CLOSE_IMAGE_ANIMATE',
}
Image.displayName = 'Image'
