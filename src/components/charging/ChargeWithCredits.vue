<template>
    <div class="component">
        <b-card class="g-card" style="background: #00b656; border-radius: 8px">
            <h5 class="card-title" style="color: white">Charge with credits</h5>
            <p class="card-title" style="color: white">Sign up and load your mPower account. Unlock a charger at eny time with your mobile phone</p>
            <b-button block variant="outline-success" style="margin-top: 1.5em; color: white; border-color: white" @click="charge()">Charge with credits</b-button>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'ChargeWithCredits',
    props: ['port'],
    data() {
        return {
            reason: 'startChargeWithCredits'
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
