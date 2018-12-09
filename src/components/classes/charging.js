const Charge = function(port) {
    this.port = port
    this.device = 'Generic device'
    this.startTime = Date.now()
    this.timeLeft = 1 * 60 * 60     // 1 hour
    this.finishedAt = this.startTime + this.timeLeft
    this.batteryLevel = 10
    const intervalId = setInterval(() => {
        this.timeLeft--
        if (this.timeLeft ===0) {
            clearInterval(intervalId);
        }
    }, 1000);
}

export default Charge
