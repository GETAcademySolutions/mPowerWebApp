const CHARGING_TIME = 60  //1 * 60 * 60     // 1 hour

const Charging = function(port, uid) {
    this.port = port
    this.device = 'Generic device'
    this.startTime = Date.now()
    this.timeLeft = CHARGING_TIME
    this.finishedAt = this.startTime + this.timeLeft
    this.batteryLevel = 10
    this.UserId = uid,
    this.id = null
}

const ChargingTimer = (charging) => {
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            charging.timeLeft--
            if (charging.timeLeft === 0) {
                clearInterval(intervalId);
                resolve(charging.id)
            } else if (charging.timeLeft < 0) {
                reject('Something went wrong')
            }
        }, 1000);
    })
}
export { Charging, ChargingTimer }
