import {mPowerBluetoothController, mPowerBluetoothControllerDummy} from "@/bluetooth/mPowerBluetoothController.js";
// import {PowerstationManager, PowerstationManagerDummy} from "@/bluetooth/PowerstationManager.js";

const controller = new mPowerBluetoothController();
// const controller = new mPowerBluetoothControllerDummy();
//const controller = new PowerstationManager();
//const controller = new DummyPowerstationManager();

// const manager = new PowerstationManager();
const manager = null;

export { controller, manager }
