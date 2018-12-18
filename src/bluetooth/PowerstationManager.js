class PowerstationManager
{
    constructor() {
        this.controller = new mPowerBluetoothController();
    }

    async turnOnOrOff(portNo, OnOffValue) {
        this.controller.writeValue([portNo, OnOffValue]);
    }

    async getPortNo() {
        this.controller.readValue();
    }

    async startCharging(portNo){
        //this.controller.
    }

    async connect() {
        return new Promise((resolve, reject) => {
            try {
                if (!this.controller.isConnected) {
                    let controllerName = this.controller.connect();
                    resolve(controllerName)
                }
            }
            catch(error) {
                reject(error);
            }
        });        
    }
}

class PowerstationManagerDummy
{
    constructor() {
    }

    async turnOnOrOff(portNo, OnOffValue) {
    }

    async getPortNo() {
        return 3;
        //return null;
    }

    async startCharging(portNo) {

    }
}

export { PowerstationManager, PowerstationManagerDummy }