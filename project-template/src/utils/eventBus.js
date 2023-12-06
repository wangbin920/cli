class Event {
    constructor() {
        this.events = {}
    }

    on (eventName, callback) {
        this.events[eventName] ? this.events[eventName].push(callback) : (this.events[eventName] = [callback])
    }

    once (eventName, callback) {
        const cb = (...args) => {
            callback(...args)
            this.off(eventName, callback)
        }
        this.on(eventName, cb)
    }

    emit (eventName, args) {
        if (!this.events[eventName]) return
        this.events[eventName].forEach(item => item(args))
    }

    off (eventName, callback) {
        if (!this.events[eventName]) return
        this.events[eventName] = this.events[eventName].filter(item => item !== callback)
    }
}

const events = new Event()
// 事件类型
const eventsType = {}

export { events, eventsType }
