<template>
    <div class="container component">
        <b-card class="g-box" style="border: none">
            <b-alert :show="dismissCountDown" dismissible @dismissed="ok()" @dismiss-count-down="countDownChanged" variant="success">
            <h4 class="alert-heading">Success!</h4>
            <!-- <p>
                Your device is now charging in USB port {{ charge.port }}. Fully charged at {{ charge.finished_at | formatTime }}
            </p> -->
            <p v-if="pluggedIn">Your device is now charging in port</p>
            <p v-else>Connect your device to port</p>
            <p class="text-center" style="font-weight: 400; font-size: 40px">{{charge.port}}</p>
            <p>Fully charged at {{ charge.finished_at | formatTime }}</p>
            <!-- <hr> -->
            <p class="mb-0">
                
            </p>
            </b-alert>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'SuccessDialog',
    components: {

    },
    props: ['charge'],
    data() {
        return {
            // success: false,
            dismissSecs: 30,
            dismissCount: 0,
            dismissCountDown: 0,
            reason: 'onSuccess'
        }
    },
    computed: {
        pluggedIn() {
            return this.charge.pluggedIn
        }
    },
    methods: {
        ok() {
            this.$emit(this.reason, this.charge.port)
        },
        countDownChanged (dismissCountDown) {
            this.dismissCount++
            if (this.dismissCount == this.dismissSecs) {
                this.$emit(this.reason, this.charge.port)
            }
            this.dismissCountDown = dismissCountDown
        },
    },
    mounted() {
        this.dismissCountDown = this.dismissSecs
    }
}
</script>

<style>

</style>
