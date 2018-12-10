<template>
    <div class="component">
        <b-card class="g-msg">
            <h6 class="card-subtitle" >{{ message }}
                <b-link class="float-right" @click="closeErrorFeedback()" style="color: #3f4140">Close</b-link>
            </h6>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'ErrorFeedback',
    props: ['message', 'fontsize'],
    data() {
        return {
            reason: 'closeErrorFeedback'
        }
    },
    methods: {
        closeErrorFeedback() {
            this.$emit(this.reason)
        }
    }
}
</script>

<style>
.g-msg {
    background: #fae6e3; 
    color: #cf5d3d; 
    border-color: #cf5d3d;
    margin: auto;
    min-width: 360px;
    max-width: 360px;
}
</style>
