<template>
    <div class="cotainer component">
        <b-card style="border: none">

        <div class="g-box text-center" style="margin-top: 20%">
            <div class="circle"><p style="font-size: 40px; color: #00b656">{{ port }}</p></div>
            <h4 style="color: #00b656">Connect to port number {{ port }}!</h4>
            <b-button @click="onOk()" block variant="outline-success" style="margin-top: 4em">OK</b-button>
        </div>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'ChargeConnect',
    props: ['port'],
    data() {
        return {
            reason: 'onSuccess'
        }
    },
    methods: {
        onOk() {
            this.$emit(this.reason, this.charge.port)
        }
    }
}
</script>

<style>
.g-box {
    margin: auto;
    min-width: 350px;
    max-width: 400px;
    margin-top: 2em;
}
.g-can{
    border: solid;
  border-color: #00b656;
  border-width: 10px;
}


.circle {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    border: 4px solid #00b656;
    /* border-width: 7px; */
    text-align: center;
    /* display: table-cell; */
    margin-left: 36%;
    margin-bottom: 2em;
    vertical-align: middle;
    /* position: relative; */
}
</style>
