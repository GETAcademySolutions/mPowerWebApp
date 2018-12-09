<template>
    <div class="component">
        <b-card style="background: #fae6e3; color: #cf5d3d; border-color: #cf5d3d">
            <h6 class="card-subtitle">{{ message }}</h6>
        </b-card>
    </div>
</template>

<script>
export default {
    name: 'ErrorFeedback',
    props: ['message', 'fontsize']
}
</script>

<style>

</style>
