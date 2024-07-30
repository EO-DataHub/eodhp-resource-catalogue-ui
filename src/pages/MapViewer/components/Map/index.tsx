import './styles.scss'
import { TileLayer } from 'react-leaflet'

const dates = [
  {
    date: '2013-06-16',
    name: 'Referral date'
  },
  {
    date: '2015-02-16',
    name: 'Some rando date'
  },
  {
    date: '2015-02-16',
    name: 'Another thing'
  },
  {
    date: '2015-10-01',
    name: 'Current shipping date'
  }
]

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