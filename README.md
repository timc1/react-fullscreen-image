<h1 align="center">
  React Fullscreen Image
</h1>
<p align="center">
  🔲
  </p>
<p align="center" style="font-size: 1.5rem;">
  A simple, fast, and beautiful fullscreen React image viewer using CSS transforms & opacity.
</p>

<p align="center">
<img src="https://github.com/timc1/react-fullscreen-image/raw/master/demo.gif" alt="demo" />
</p>

You've got a list of images that you want to allow users to click and expand into fullscreen mode.

React Fullscreen Image is a tiny library to render images that animate to fullscreen view when
clicked.

A live demo can be viewed on [CodeSandbox](https://codesandbox.io/s/o9m59jj3oq)!

## Features

- Only animates transform and opacity properties.
- Keyboard event handlers (escape key, left/right arrow navigation).
- Handles outer click — anywhere outside of image when clicked will zoom image to its original
  position.
- Scrolling (with requestAnimationFrame) to a set boundary will zoom image to its original position.

## Usage

React Fullscreen Image uses [compound components](https://kentcdodds.com/blog/compound-components-with-react-hooks). All `<Image />` components nested within an `<ImageGroup />` will be navigatable when in fullscreen mode.

```jsx
import { ImageGroup, Image } from 'react-fullscreen-image'

const images = [
  'some_image_url',
  'some_image_url',
  'some_image_url',
  'some_image_url'
]

export default function App() {
  return (
    <ImageGroup>
      <ul className="images">
        {images.map(i => (
          <li key={i}>
            <Image
              src={i}
              alt="nature"
            />
          </li>
        ))}
      </ul>
    </ImageGroup>
  )
}
```

## Installation

```jsx
git clone https://github.com/timc1/react-fullscreen-image.git

cd react-fullscreen-image/example

yarn install

yarn start
```
