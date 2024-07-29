import { useEffect } from 'react'
import './styles.scss'
import { TileLayer } from 'react-leaflet'

const Map = () => {
  return (
    <div>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </div>
  )
}

export default Map;