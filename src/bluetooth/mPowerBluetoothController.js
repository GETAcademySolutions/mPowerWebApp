/*
 *
 *
 
const controller = new mPowerBluetoothController();
await controller.connect();

 */

class mPowerBluetoothControllerDummy {

    constructor() {
      this.serviceUuid = '0000f00d-1212-efde-1523-785fef13d123';
      this.options = {
        filters: [{
          name: "mPower"
        }, {
          services: [this.serviceUuid]
        }],
        optionalService: [this.serviceUuid]
      };
      this.characteristicUuid = "0000beef-1212-efde-1523-785fef13d123";
      this.isConnected = false;
    }
  
    async connect() {
      return "mPower"
    }
  
    async turnOnOrOff(portNo, OnOffValue) {
      console.log('dummy ble turnOnOrOff', portNo, OnOffValue);
    }
  
    async readValue() {
      return 5;
    }
  }
  
  
  var bluetoothDevice = null;

  /*jshint esversion: 6 */
  class mPowerBluetoothController {
    
    constructor() {
      this.serviceUuid = '0000f00d-1212-efde-1523-785fef13d123';
      this.options = {
        filters: [{
          name: "mPower"
        }, {
          services: [this.serviceUuid]
        }],
        optionalService: [this.serviceUuid]
      };
      this.cmdCharacteristicUuid = "0000beef-1212-efde-1523-785fef13d123";
      this.alertCharacteristicUuid = "0000beef-1212-efde-1523-785fef13d123";
      this.isConnected = false;
    }
 
    onDisconnected(event) {
      // Object event.target is Bluetooth Device getting disconnected.
      log('> Bluetooth Device disconnected');
    }
    
    async connect() {
        // const device = await navigator.bluetooth.requestDevice(this.options);
        // const server = await device.gatt.connect();
        // this.service = await server.getPrimaryService(this.serviceUuid);
        // this.characteristic = await this.service.getCharacteristic(this.characteristicUuid);
        // this.characteristic.addEventListener("characteristic value changed", this.handleNotifications);
        // this.isConnected = true;
        // console.log("RETURNER ", device.name);
        // return device.name;


        return new Promise((resolve, reject) => {
            console.log('Requesting Bluetooth Device...');
            navigator.bluetooth.requestDevice(this.options)
            .then((device) => {
                bluetoothDevice = device;
                bluetoothDevice.addEventListener('gattserverdisconnected', this.handleNotifications);
                return device.gatt.connect();
            })
            .then((server) => {
                return server.getPrimaryService(this.serviceUuid)
            })
            .then((service) => {
                this.service = service
                return this.service.getCharacteristic('this.cmdCharacteristicUuid')
            })
            .then((characteristic) => {
                this.cmdCharacteristic = characteristic
                return characteristic.addEventListener("characteristic value changed", this.handleNotifications);
            })
            .then(() => {
                return this.service.getCharacteristic('this.alertCharacteristicUuid')
            })
            .then((characteristic) => {
                this.alertCharacteristic = characteristic
                return characteristic.addEventListener("characteristic value changed", this.handleNotifications);
            })
            .then(() => {
                this.isConnected = true;
                console.log("Connected!!", device.name);
                resolve(bluetoothDevice.name)
            })
            .catch(error => {
                console.log('BluetoothController connect failed: ' + error);
                reject(error)
            });
        })
    }
 
    async disconnect() {
      if (!bluetoothDevice) {
        return;
      }
      log('Disconnecting from Bluetooth Device...');
      if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
      } else {
        log('> Bluetooth Device is already disconnected');
      }
    }

    async writeValue(dataArray){
        //const characteristic = await this.service.getCharacteristic(this.characteristicUuid);
        for(let i = 0; dataArray.length; i++){
            dataArray[i] = parseInt("0x" + dataArray[i])
        }
        const data = new Uint8Array(dataArray)
        //await characteristic.writeValue(data);

        return new Promise((resolve, reject) => {
            return this.cmdCharacteristic.writeValue(data)
            .then(() => {
                console.log('Written to cmdChar')
                resolve('success')
            })
            .catch(error => { 
                console.log(error)
                reject(error)
            });
        })
      }
  
  
    async turnOnOrOff(portNo, OnOffValue) {
        // const characteristic = await this.service.getCharacteristic(this.characteristicUuid);
        const onOff = parseInt("0x" + OnOffValue);
        const portNumber = parseInt("0x" + portNo);
        const data = new Uint8Array([onOff, portNumber]);
        // await characteristic.writeValue(data);
        // console.log("Turn on/off, activated");

        return new Promise((resolve, reject) => {
            return this.cmdCharacteristic.writeValue(data)
            .then(() => {
              console.log("Turn on/off, activated");
              resolve('success')
            })
            .catch(error => { 
                console.log(error)
                reject(error)
            });
        })
    }
  
    async handleNotifications(event) {
      let value = event.target.value;
      let a = [];
      for (let i = 0; i < value.byteLength; i++) {
        a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
      }
      log('> ' + a.join(' '));
    }
  
    async readValue() {
      const characteristic = await this.service.getCharacteristic(this.characteristicUuid);
      var x = await characteristic.readValue();
      console.log("readValue = ", x);
      return x;
    }
  }
  export {mPowerBluetoothController, mPowerBluetoothControllerDummy} ;
  