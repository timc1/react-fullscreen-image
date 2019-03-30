import React from 'react'

type ImageGroupState = {
  currentFocusedImageIndex: number
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
        currentFocusedImageIndex: action.payload.index,
      }
    default:
      throw new Error(`No action type of "${action.type}" found.`)
  }
}

ImageGroup.actions = {
  toggleExpandImage: 'TOGGLE_EXPAND_IMAGE',
}
Image.displayName = 'Image'

export function ImageGroup({ children }: { children: React.ReactNode }): any {
  const [state, dispatch] = React.useReducer(reducer, {
    currentFocusedImageIndex: -1,
  })

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
        onClick: () =>
          dispatch({
            type: ImageGroup.actions.toggleExpandImage,
            payload: {
              index,
            },
          }),
      })
    }
  )

  console.log('state', state)

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
  const { onClick, ...rest } = props
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
  fn: (child: React.ReactNode, index: number) => any
): {
  updatedChildren: React.ReactNode
  count: number
} {
  let count = 0

  function recursiveMap(children: React.ReactNode): React.ReactNode {
    return React.Children.map(children, child => {
      // @ts-ignore
      if (child.type.displayName === 'Image') {
        count++
        child = fn(child, count)
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
