<template>
    <div class="component">
        <div>
            <h4>Enter port number</h4>
            <p class="card-text" style="margin-top: 1em; margin-bottom: 1em">If you have already plugged in your device i a port, we need to know the port number.</p>
        </div>
        <error-feedback v-if="feedback" class="" :message="feedback"></error-feedback>
        <b-form class="" @submit.prevent="onChange">
            <b-form-group id="email" label="" label-for="port">
                <b-form-input id="port" type="number" @change="onChange()" v-model="portNo" required
                            placeholder="Port number">
                </b-form-input>
            </b-form-group>
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
            portNo: null
        }
    },
    methods: {
        onChange() {
            if (this.portNo > 10) {
                this.feedback = 'Port number must be in the range 1 to 10'
            }
            this.$emit(this.reason, this.portNo)
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
