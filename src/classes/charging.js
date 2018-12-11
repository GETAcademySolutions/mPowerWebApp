const CHARGING_TIME = 3 * 60  //1 * 60 * 60     // 1 hour

const Charging = function(port, uid) {
    this.port = port
    this.device = 'Generic device'
    this.start_time = Date.now()
    this.time_left = CHARGING_TIME
    this.finished_at = this.start_time + this.time_left
    this.battery_level = 10
    this.user_id = uid,
    this.id = null
}

const CloneCharging = function(item) {
    this.port = item.port
    this.device = item.device
    this.start_time =item.start_time
    this.time_left = item.time_left
    this.finished_at = item.finished_at
    this.battery_level = item.battery_level
    this.user_id = item.user_id
    this.id = null
}

const ChargingTimer = (charging) => {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            charging.time_left--
            if (charging.time_left === 0) {
                clearInterval(intervalId);
                resolve(charging.id)
            } else if (charging.time_left < 0) {
                reject('Something went wrong')
            }
        }, 1000);
    })
}
export { Charging, CloneCharging, ChargingTimer }
