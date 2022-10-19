<template>
    <div>
        <input @input="onInput" @keyup.enter="onSubmit"/>
        <button @click="onSubmit"> Send! </button>
        <li v-for="{msg, time} in this.chat" :key="time">
            {{msg}} - {{time}}
        </li>
    </div>
</template>

<script>
export default {
    name: "App",
    data: () => {
        return {
            message: "",
            chat: []
        }
    },
    methods: {
        onInput(event) {
            this.message = event.target.value
        },
        onSubmit() {
            this.chat.push({
                msg: this.message,
                time: new Date().toLocaleTimeString()
            })
        }
    }
}
</script>

<style>
</style>