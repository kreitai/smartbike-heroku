console.log('Started')
const request = require('request')
const admin = require('firebase-admin')
const dbUrl = require('./db-url.json')
const dbKey = require('./smartbike-key.json')

admin.initializeApp({
  credential: admin.credential.cert(dbKey),
  databaseURL: dbUrl.url
})

const db = admin.database()
var stationsRef = db.ref('stations')

function fetchStations () {
  request('https://apis.youbike.com.tw/api/front/station/all?lang=en&type=1', function (error, response, body) {
    console.error('error:', error)
    console.log('statusCode:', response && response.statusCode)
    var stationList = JSON.parse(body).retVal

    var stationStates = []
    stationList.forEach(station => {
      if (station.available_spaces > 0 && station.empty_spaces > 0) {
        stationStates.push({
          station_no: station.station_no, status: 0
        })
      } else if (station.available_spaces > 0) {
        stationStates.push({
          station_no: station.station_no, status: 1
        })
      } else {
        stationStates.push({
          station_no: station.station_no, status: 2
        })
      }
    })

    stationsRef.set(stationStates, function (error) {
      if (error) {
        console.log('Data could not be saved. ' + error)
      } else {
        console.log('Data saved successfully.')
      }
    })
  })
}
fetchStations()
