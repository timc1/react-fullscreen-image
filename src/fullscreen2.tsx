import React from 'react'

type ImageGroupState = {
  currentExpandedImageIndex: number | null
  numberOfChildImageComponents: any
}

function reducer(
  state: ImageGroupState,
  action: { type: string; payload: any }
): ImageGroupState {
  switch (action.type) {
    case ImageGroup.actions.toggleExpandImage:
      return {
        ...state,
        currentExpandedImageIndex: action.payload.id,
      }
    default:
      throw new Error(`No type of "${action.type}" is defined.`)
  }
}

ImageGroup.actions = {
  toggleExpandImage: 'TOGGLE_EXPAND_IMAGE',
}

export function ImageGroup({ children }: { children: any }) {
  const [state, dispatch] = React.useReducer(reducer, {
    currentExpandedImageIndex: null,
    numberOfChildImageComponents: getChildImageComponentsLength(children),
  })

  let index = 0
  const c = mapPropsToImageComponents(children, child => {
    // Save index++ in a closure so our onClick can reference the current value.
    const id = index++
    // @ts-ignore
    return React.cloneElement(child, {
      id,
      isExpanded: state.currentExpandedImageIndex === id,
      onClick: (e: React.ChangeEvent) => {
        dispatch({
          type: ImageGroup.actions.toggleExpandImage,
          payload: {
            id,
            element: e.target,
          },
        })
      },
    })
  })

  return <>{c}</>
}

export function Image({ src, alt, ...props }: { src: string; alt: string }) {
  // @ts-ignore
  const { isExpanded, ...rest } = props

  const smallImage = React.useRef<any>()
  const largeImage = React.useRef<any>()

  const initialRender = React.useRef(false)
  React.useEffect(() => {
    // Only run after first render.
    if (initialRender.current) {
      if (isExpanded) {
        console.log('open image', largeImage.current)
      } else {
        console.log('close image', largeImage.current)
      }
    } else {
      initialRender.current = true
    }
  }, [isExpanded])

  return (
    <button
      style={{
        border: 'none',
        background: 'none',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        height: '100%',
        width: '100%',
        padding: '0',
        WebkitAppearance: 'none',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <img ref={smallImage} src={src} alt={alt} style={{ zIndex: -1 }} />
      <img
        ref={largeImage}
        src={src}
        alt={alt}
        style={{ opacity: 0, zIndex: -1 }}
      />
    </button>
  )
}

ImageGroup.displayName = 'ImageGroup'
Image.displayName = 'Image'

// Recursively checks children and maps props to all <Image /> components.
function mapPropsToImageComponents(
  children: React.ReactNode,
  fn: (child: React.ReactNode) => any
): React.ReactNode {
  return React.Children.map(children, child => {
    // @ts-ignore
    if (child.type.displayName === 'Image') {
      // @ts-ignore
      child = fn(child)
      return child
    }

    if (!React.isValidElement(child)) {
      return child
    }

    // @ts-ignore
    if (child.props.children) {
      child = React.cloneElement(child, {
        // @ts-ignore
        children: mapPropsToImageComponents(child.props.children, fn),
      })
    }

    return child
  })
}

function getChildImageComponentsLength(children: React.ReactNode) {
  let imageComponents: number = 0

  function count(children: React.ReactNode): any {
    return React.Children.map(children, child => {
      // @ts-ignore
      if (child.type.displayName === 'Image') {
        imageComponents++
        return child
      }

      if (!React.isValidElement(child)) {
        return child
      }

      // @ts-ignore
      if (child.props.children) {
        child = React.cloneElement(child, {
          // @ts-ignore
          children: count(child.props.children),
        })
      }

      return child
    })
  }

  count(children)
  return imageComponents
}
