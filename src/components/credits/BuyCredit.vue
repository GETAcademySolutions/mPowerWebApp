<template>
    <div class="container component">
        <div v-if="!success">
            <div class="g-card">
                <h5>Load your mPower account</h5>
            </div>
            <div class="g-card g-mt">
                <p style="margin-bottom: 0">Your balance</p>
                <h5>{{balance}} Credits</h5>
            </div>
            <div class="g-card g-mt">
                <b-form-group style="" label="">
                    <p style="margin-bottom: 0">Select amount</p>
                    <b-form-radio-group id="amount" v-model="amount" :options="amounts" stacked plain name="radioAmounts">
                    </b-form-radio-group>
                </b-form-group>
            </div>
            <div class="g-card">
                <b-form-group style="" label="">
                    <p style="margin-bottom: 0">Select payment</p>
                    <b-form-radio-group id="payment" v-model="payment" :options="payments" stacked plain name="radioPayments">
                    </b-form-radio-group>
                </b-form-group>
            </div>
            <div class="g-card">
                <h5>Payment: ${{amount}}</h5>
            </div>
            <b-button @click="buy()" variant="success" block class="g-box g-mt" style="max-width: 50%">Next</b-button>

            <error-feedback v-if="feedback" class="" :message="feedback" style="margin-bottom: 1em"></error-feedback>
        </div>

        <div v-else class="g-box" style="border: none">
            <b-alert :show="dismissCountDown" dismissible @dismissed="ok()" @dismiss-count-down="countDownChanged" variant="success">
                <h4 class="alert-heading">Success!</h4>
                <p>
                    Your balance is now {{ balance }} credits
                </p>
                <!-- <hr> -->
                <p class="mb-0">
                    
                </p>
            </b-alert>
        </div>
    </div>
</template>

<script>
import ErrorFeedback from '@/components/common/ErrorFeedback'

export default {
    name: 'BuyCredit',
    data () {
        return {
            amount: 5,
            amounts: [
                { text: '5 Credits', value: 5 },
                { text: '10 Credits', value: 10 },
                { text: '20 Credits', value: 20 },
                { text: '30 Credits', value: 30 },
            ],
            payment: 'mPesa',
            payments: [
                { text: 'mPesa', value: 'mPesa' },
                { text: 'PayPal', value: 'PayPal' },
            ],
            success: false,
            feedback: '',
            dismissSecs: 5,
            dismissCount: 0,
            dismissCountDown: 0
        }
    },
    computed: {
        balance() {
            return this.$store.state.profile.credits
        }
    },
    methods: {
        ok() {
            this.$router.push({ name: 'HomePage'})
        },
        buy() {
            try {
                let token = this.$store.state.database.getAccessToken()
                this.$store.state.database.addCredits(this.$store.state.profile.slug, this.amount)
                this.success = true
                this.dismissCountDown = this.dismissSecs
            } catch(error) {
                this.feedback = error                
            }
        },
        countDownChanged (dismissCountDown) {
            this.dismissCount++
            if (this.dismissCount == this.dismissSecs) {
                this.$router.push({ name: 'HomePage'})
            }
            this.dismissCountDown = dismissCountDown
        },
    },
    created() {
        if(!this.$store.state.profile) {
            this.$store.state.profile = this.$store.state.database.getProfile()
        }
    }
}
</script>

<style>

</style>
  