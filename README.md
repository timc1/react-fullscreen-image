<h1 align="center">
  React Fullscreen Images 
</h1>
<p align="center" style="font-size: 1.5rem;">
  A simple, fast, and beautiful fullscreen React image viewer using CSS transforms & opacity.
</p>

You've got a list of images that you want to allow users to click and expand into fullscreen mode.

React Fullscreen Images is a tiny library to render images that animate to fullscreen view when
clicked.

## Features

- Only animates transform and opacity properties.
- Keyboard event handlers (escape key, left/right arrow navigation).
- Handles outer click — anywhere outside of image when clicked will zoom image to its original
  position.
- Scrolling, (with requestAnimationFrame) to a set boundary will zoom image to its original position.

<p align="center">
<img src="demo.gif" alt="demo" />
</p>

## Usage

React Fullscreen Images uses [compound components](https://kentcdodds.com/blog/compound-components-with-react-hooks). All `<Image />` components nested within an `<ImageGroup />` will be navigatable when in fullscreen mode.

```jsx
const images = [
  'https://unsplash.com/photos/Bkci_8qcdvQ',
  'https://unsplash.com/photos/hS46bsAASwQ',
  'https://unsplash.com/photos/2VDa8bnLM8c',
  'https://unsplash.com/photos/_LuLiJc1cdo',
  'https://unsplash.com/photos/1Z2niiBPg5A',
  'https://unsplash.com/photos/pHANr-CpbYM',
  'https://unsplash.com/photos/pQMM63GE7fo',
  'https://unsplash.com/photos/2VDa8bnLM8c',
  'https://unsplash.com/photos/MBkQKiH14ng',
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
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </li>
        ))}
      </ul>
    </ImageGroup>
  )
}
```
