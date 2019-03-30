import React from 'react'
import './app.css'

import image1 from './assets/images/unsplash_image_1.jpeg'
import image2 from './assets/images/unsplash_image_2.jpeg'
import image3 from './assets/images/unsplash_image_3.jpeg'
import image4 from './assets/images/unsplash_image_4.jpeg'
import image5 from './assets/images/unsplash_image_5.jpeg'
import image6 from './assets/images/unsplash_image_6.jpeg'
import image7 from './assets/images/unsplash_image_7.jpeg'
import image8 from './assets/images/unsplash_image_8.jpeg'
import image9 from './assets/images/unsplash_image_9.jpeg'

import { ImageGroup, Image } from './fullscreen'

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
]

export default function App() {
  return (
    <div className="container">
      <ImageGroup>
        <ul className="images">
          {images.map(i => (
            <li key={i}>
              <Image src={i} alt="mountains" />
            </li>
          ))}
        </ul>
      </ImageGroup>
    </div>
  )
}
