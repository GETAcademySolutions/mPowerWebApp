<template>
    <div class="component">
        <b-card class="g-card" style="border-radius: 8px">
            <h5 class="card-title">Charge with code</h5>
            <p class="card-title">Pay for charging at one of the mPower stations and get a one time charging code.</p>
            <b-button block variant="outline-secondary" style="margin-top: 1.5em" @click="charge()">Charge with code</b-button>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'ChargeWithCode',
    props: ['port'],
    data() {
        return {
            reason: 'startChargeWithCode'
        }
    },
    methods: {
        charge() {
            this.$emit(this.reason)
        }
    }
}
</script>

<style>

</style>
