<template> 
    <div class="component">
        <div v-for="elem in charges" :key="elem.id">
            <b-card class="g-card" style="border-radius: 8px">
                <b-row>
                    <b-col>
                        <p class="g-text"  style="margin-bottom: 0">Port: {{ elem.port }}</p>
                    </b-col>
                    <b-col class="">
                        <p class="g-text g-right" style="margin-bottom: 0">{{ elem.battery_level }}%</p>
                    </b-col>
                </b-row>
                <p class="g-text">Device: {{ elem.device }}</p>
                <div v-if="elem.time_left > 0">
                    <p class="g-count">{{ elem.time_left | secondsToTime }}</p>
                    <p class="g-text" style="margin-bottom: 0">Fully charged at {{ elem.finished_at | formatTime }}</p>
                </div>
                <div v-else>
                    <p class="g-count">Fully Charged!</p>
                    <!-- <b-link class="float-right" style="color: #3f4140; font-weight: 500">Close</b-link> -->
                    <b-button @click="close(elem)" block variant="outline-secondary" style="margin-top: 0.5em">Close</b-button>
                </div>
            </b-card>
        </div>
    </div>
</template>

<script>
import ErrorFeedback from '@/components/common/ErrorFeedback'

export default {
    name: 'ChargingList',
    components: {
        ErrorFeedback
    },
    props: ['charges', 'message', 'fontsize'],
    data() {
        return {
            reason: 'stopCharging'
        }
    },
    methods: {
        close(item) {
            this.$emit(this.reason, item.id)
        }
    }

}
</script>

<style>
.g-card {
    min-width: 360px;
    max-width: 500px;
    width: 50%;
    margin-top: 1em;
}
.g-text {
    font-weight: 530;
}
.g-right {
    text-align: right;
    font-size: 16px;
    font-weight: 500;
    color: #00b656;
}
.g-count {
    font-weight: 500;
    font-size: 40px;
    color: #00b656;
}
</style>
