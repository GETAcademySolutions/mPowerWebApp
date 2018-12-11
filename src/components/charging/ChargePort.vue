<template>
    <div class="container">
        <b-form class="g-box" @submit.prevent="charge">
            <div>
                <h4>Enter port number</h4>
                <p class="card-text" style="margin-top: 1em; margin-bottom: 1em">If you have already plugged in your device i a port, we need to know the port number.</p>
            </div>
            <error-feedback v-if="feedback" class="" :message="feedback"></error-feedback>
            <b-form-group id="email" label="" label-for="port">
                <b-form-input id="port" type="number" @change="onChange()" v-model="port" required
                            placeholder="Port number">
                </b-form-input>
            </b-form-group>
            <b-button @click="charge()" block style="background: #00b656">Connect</b-button>
        </b-form>
    </div>
</template>

<script>
import ErrorFeedback from '@/components/common/ErrorFeedback'

export default {
    name: 'ChargePort',
    components: {
        ErrorFeedback
    },
    // props: ['portNo'],
    data() {
        return {
            feedback: null,
            reason: 'portNumberChanged',
            port: null
        }
    },
    methods: {
        charge() {
            if (this.port > 10) {
                this.feedback = 'Port number must be in the range 1 to 10'
            }
            this.$emit(this.reason, this.port)
        }
    }
}
</script>

<style>
.g-box {
    margin: auto;
    min-width: 350px;
    max-width: 400px;
    margin-top: 1em;
}
</style>
