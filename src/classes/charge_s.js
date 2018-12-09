import { isNullOrUndefined } from "util";

const Charge = function(port) {
    this.port = port
    this.device = 'Generic device'
    this.startTime = Date.now()
    this.stopTime = null
    this.timeLeft = 1 * 60 * 60     // 1 hour
    this.finishedAt = this.startTime + this.timeLeft
    this.batteryLevel = 10
    this.user_id = null
}

const Charging = function(c) {
    return new Promise((resolve, reject) => {
        this.charge = c
        const intervalId = setInterval(() => {
            this.charge.timeLeft--
            if (this.charge.timeLeft === 0) {
                clearInterval(intervalId);
                resolve()
            } else if (this.charge.timeLeft < 0) {
                reject('Something went wrong')
            }
        }, 1000);
    })
}
// export default Charge
export { Charging, Charge }