import { defineStore } from 'pinia'

export const useStore = defineStore('appstore', {
    state() {
        return {       
            drawer: null,     
            mytext: 'Test Pinia',            
        }
    },
    actions: {
        clearText() {
            this.mytext = ''
        }
    }
})

