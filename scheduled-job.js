console.log('Started')
const request = require('request')

function fetchStations () {
  request('https://apis.youbike.com.tw/api/front/station/all?lang=en&type=1', function (error, response, body) {
    console.error('error:', error)
    console.log('statusCode:', response && response.statusCode)
    var stationList = JSON.parse(body).retVal
    var stationStates = new Map()
    stationList.forEach(station => {
      if (station.available_spaces > 0 && station.empty_spaces > 0) {
        stationStates.set(station.station_no, 0)
      } else if (station.available_spaces > 0) {
        stationStates.set(station.station_no, 1)
      } else {
        stationStates.set(station.station_no, 2)
      }
    })
    console.log('stations:', stationStates)
  })
}
fetchStations()
