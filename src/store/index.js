import Vue from 'vue'
import Vuex from 'vuex'
import {Database} from "@/classes/database.js";
import {mPowerBluetoothController, mPowerBluetoothControllerDummy} from "@/bluetooth/mPowerBluetoothController.js";


Vue.use(Vuex)

export const store = new Vuex.Store({
    state: { 
        controller: new mPowerBluetoothController,
        database: new Database(),
        location: { id: '11', name: 'mPower Kiosk' },
        profile: null,
        credits: 0,
        charges: [],
        user: { id: null }
    },
    actions: {},
    getters: {}
})

