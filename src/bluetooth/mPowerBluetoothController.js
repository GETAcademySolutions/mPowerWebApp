import { isNull } from "util";

/*
 *
 *
 
const controller = new mPowerBluetoothController();
await controller.connect();

 */

class mPowerBluetoothControllerDummy {

    constructor() {
      //this.serviceUuid = '0000f00d-1212-efde-1523-785fef13d123';
      this.serviceUuid = '000f00d-54b0-41a5-8e4b-25d85883ae56'
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
      //this.serviceUuid = '0000f00d-1212-efde-1523-785fef13d123';
      this.serviceUuid = '0000f00d-6cc7-425b-ad67-fccdafa33672'
      this.options = {
        filters: [{
          name: "mPower"
        }, {
          services: [this.serviceUuid]
        }],
        optionalService: [this.serviceUuid]
      };
    //   this.cmdCharacteristicUuid = "0000beee-1212-efde-1523-785fef13d123";
    //   this.alertCharacteristicUuid = "0000beef-1212-efde-1523-785fef13d123";
      this.cmdCharacteristicUuid   = "0000beee-6cc7-425b-ad67-fccdafa33672";
      this.alertCharacteristicUuid = "0000beef-6cc7-425b-ad67-fccdafa33672";
      this.isConnected = false;
      this.response = {
        message: null
      }
    }
 
    onDisconnected(event) {
      // Object event.target is Bluetooth Device getting disconnected.
      console.log('> Bluetooth Device disconnected', event);
    }
    
    async reconnect(onBleDisconnected, onBleNotification) {
        this.isConnected = false
        bluetoothDevice = null
        return new Promise((resolve, reject) => {
            this.connect(onBleDisconnected, onBleNotification)
            .then(() => {
                resolve('reconnected')
            })
            .catch((error) => {
                console.log('BluetoothController connect failed: ' + error);
                reject(error)
            })
        })
    }

    async connect(onBleDisconnected, onBleNotification) {

        // const device = await navigator.bluetooth.requestDevice(this.options);
        // const server = await device.gatt.connect();
        // this.service = await server.getPrimaryService(this.serviceUuid);
        // this.characteristic = await this.service.getCharacteristic(this.alertCharacteristicUuid);
        // // this.characteristic.addEventListener("characteristic value changed", this.handleNotifications);
        // this.characteristic.addEventListener("characteristic value changed", onBleNotification);
        // this.isConnected = true;
        // console.log("RETURNER ", device.name);
        // return device.name;

        return new Promise((resolve, reject) => {
            console.log('Requesting Bluetooth Device...');
            navigator.bluetooth.requestDevice(this.options)
            .then((device) => {
                console.log('connect, device', device);
                bluetoothDevice = device;
                bluetoothDevice.addEventListener('gattserverdisconnected', onBleDisconnected);
                console.log('connect, added disconnect event listener');
                return device.gatt.connect();
            })
            .then((server) => {
                console.log('connect, server', server);
                return server.getPrimaryService(this.serviceUuid)
            })
            .then((service) => {
                console.log('connect, service', service);
                this.service = service
                return this.service.getCharacteristic(this.alertCharacteristicUuid)
            })
            .then((characteristic) => {
                console.log('connect, char', characteristic);
                this.alertCharacteristic = characteristic
                return characteristic.addEventListener("characteristic value changed", onBleNotification);
            })
            .then(() => {
                console.log('connect, added notify event listener');
                this.isConnected = true;
                console.log("Connected!!", bluetoothDevice.name);
                resolve(bluetoothDevice.name)
            })
            .catch((error) => {
                console.log('BluetoothController connect failed: ' + error);
                reject(error)
            });
        })
    }
 
    async disconnect() {
      if (!bluetoothDevice) {
        return;
      }
      console.log('Disconnecting from Bluetooth Device...');
      if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
      } else {
        console.log('> Bluetooth Device is already disconnected');
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
            if (!this.isConnected){
              this.response.message = 'No Bluetooth connection'
              reject(this.response)
            }
            this.service.getCharacteristic(this.cmdCharacteristicUuid)
            .then((characteristic) => {
                characteristic.writeValue(data)
            })
            .then(() => {
                // Getting Battery Level Characteristic...
                return this.service.getCharacteristic(this.alertCharacteristicUuid);
            })
            .then(characteristic => {
                // Reading ack/nackl message
                return characteristic.readValue();
            })
            .then(value => {
                console.log('ack/nack value=' + value.getUint16(0));
                let resp = value.getUint8(0)
                if (resp == 0) {
                  resolve(value.getUint8(1))
                } else {
                  this.response.errorCode = value.getUint8(1)
                  this.response.message = 'failed to turn on/off power'
                  reject(this.response)
                }
            })
            .catch(error => {
                console.log(error)
                reject(error)
            })
        })
    }
  
    async handleNotifications(event) {
      let value = event.target.value;
      let a = [];
      for (let i = 0; i < value.byteLength; i++) {
        a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
      }
      console.log('> ' + a.join(' '));
    }
  
    async readValue() {
        return new Promise((resolve, reject) => {
            this.service.getCharacteristic(this.alertCharacteristicUuid)
            .then((characteristic) => {
                characteristic.readValue()
            })
            .then((result) => {
                resolve(result)
            })
            .catch((error => {
                reject(error)
            }))
        })
    }
  }

  export {mPowerBluetoothController, mPowerBluetoothControllerDummy} ;
  