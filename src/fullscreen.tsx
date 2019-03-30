import React from 'react'

export function ImageGroup({ children }: { children: React.ReactNode }): any {
  /**
   * Returns the updated children with props passed to all nested <Image />
   * and the number of <Image /> components nested.
   */
  const { updatedChildren, count } = mapPropsToChildren(children, child => {
    // @ts-ignore
    return React.cloneElement(child, {
      onClick: () => console.log('click', count),
    })
  })

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
  const { onClick } = props
  return (
    <button
      onClick={onClick}
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
    >
      <img src={src} alt={alt} />
    </button>
  )
}

Image.displayName = 'Image'

function mapPropsToChildren(
  children: React.ReactNode,
  fn: (child: React.ReactNode) => any
) {
  let count = 0

  function recursiveMap(children: React.ReactNode): React.ReactNode {
    return React.Children.map(children, child => {
      // @ts-ignore
      if (child.type.displayName === 'Image') {
        count++
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
