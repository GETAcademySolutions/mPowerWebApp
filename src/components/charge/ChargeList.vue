<template> 
    <div class="component">
        <div v-for="elem in charges" :key="elem.id">
            <b-card class="g-card" style="border-radius: 8px">
                <b-row>
                    <b-col>
                        <p class="g-text"  style="margin-bottom: 0">Port: {{ elem.port }}</p>
                    </b-col>
                    <b-col class="">
                        <p class="g-text g-right" style="margin-bottom: 0">{{ elem.batteryLevel }}%</p>
                    </b-col>
                </b-row>
                <p class="g-text" style="margin-bottom: 0; margin-top: 0">Device: {{ elem.device }}</p>
                <p class="g-count" style="margin-bottom: 0; margin-top: 0">{{ elem.timeLeft | secondsToTime }}</p>
                <p class="g-text" style="margin-bottom: 0">Fully charged at {{ elem.finishedAt | formatTime }}</p>
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChargeList',
    props: ['charges'],
    data() {
        return {

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
