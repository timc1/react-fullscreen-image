import React from 'react'

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
        'data-fullscreen': index,
        isFocused: state.currentFocusedImageIndex === index,
        hasAnimatedZoomAlready: state.hasAnimatedZoomAlready,
        onClick: () =>
          dispatch({
            type:
              state.currentFocusedImageIndex !== null
                ? ImageGroup.actions.toggleExpandImage
                : ImageGroup.actions.toggleExpandImageAnimate,
            payload: {
              index,
            },
          }),
      })
    }
  )

  return updatedChildren
}

export function Image({
  src,
  alt,
  ...props
}: {
  src: string
  alt: string
}): any {
  // @ts-ignore
  const { onClick, isFocused, hasAnimatedZoomAlready, ...rest } = props
  const isCurrentlyFocused = React.useRef(false)

  const initialRender = React.useRef(false)
  React.useEffect(() => {
    if (initialRender.current) {
      if (isFocused) {
        isCurrentlyFocused.current = true
        if (hasAnimatedZoomAlready) {
          // Immediately show
          console.log('immediately show')
        } else {
          // Animate in
          console.log('animate in')
        }
      } else {
        if (isCurrentlyFocused.current) {
          if (hasAnimatedZoomAlready) {
            // Immediately hide
            console.log('immediately hide')
          } else {
            // Animate out
            console.log('animate out')
          }

          isCurrentlyFocused.current = false
        }
      }
    } else {
      initialRender.current = true
    }
  }, [isFocused, hasAnimatedZoomAlready])

  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
      }}
      {...rest}
    >
      <button
        onClick={onClick}
        style={{
          border: 'none',
          background: 'none',
          position: 'inherit',
          top: 'inherit',
          left: 'inherit',
          right: 'inherit',
          bottom: 'inherit',
          height: '100%',
          width: '100%',
          padding: '0',
          WebkitAppearance: 'none',
          cursor: 'pointer',
        }}
      >
        <img src={src} alt={alt} />
      </button>
    </div>
  )
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
}
Image.displayName = 'Image'
