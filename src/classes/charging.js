import store from '../store'

const DEFAULT_LOCATION_ID = 11
const DEFAULT_CHARGING_TIME = 3 * 60  //1 * 60 * 60     // 1 hour

const Charging = function(port, uid) {
    this.location_id = DEFAULT_LOCATION_ID
    this.port = port
    this.device = 'Generic device'
    this.pluggedIn = false
    this.start_time = Date.now()
    this.time_left = DEFAULT_CHARGING_TIME
    this.finished_at = this.start_time + this.time_left
    this.battery_level = 10
    this.user_id = uid
    this.id = null
}

const CloneCharging = function(item) {
    this.location_id = item.location_id
    this.port = item.port
    this.device = item.device
    this.pluggedIn = false
    this.start_time =item.start_time
    this.time_left = item.time_left
    this.finished_at = item.finished_at
    this.battery_level = item.battery_level
    this.user_id = item.user_id
    this.id = null
}

const ChargingTimer = (charge, database) => {
    return new Promise((resolve, reject) => {
        let count = 3
        const intervalId = setInterval(() => {
            charge.time_left--
            if ((count--) === 0) {
                database.updateChargeTime(charge)
                count = 3
            } 
            if (charge.time_left === 0) {
                clearInterval(intervalId)
                resolve(charge.id)
            } else if (charge.time_left < 0) {
                reject('Something went wrong')
            }
        }, 1000);
    })
}
export { Charging, CloneCharging, ChargingTimer }
