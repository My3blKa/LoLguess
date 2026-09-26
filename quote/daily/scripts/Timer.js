class Timer {
    selectors = {
        secondsItem: "[data-js-timer-seconds]",
        minutesItem: "[data-js-timer-minutes]",
        hoursItem: "[data-js-timer-hours]"
    }

    constructor() {
        this.secondsElement = document.querySelector(this.selectors.secondsItem);
        this.minutesElement = document.querySelector(this.selectors.minutesItem);
        this.hoursElement = document.querySelector(this.selectors.hoursItem);


        this.bindEvents()
    }

    startTimer = () => {
        this.nowData = new Date()
        this.nextData = new Date() 
        this.nextData.setUTCHours(24, 0, 0, 0)
        this.diffData = this.nextData - this.nowData

        this.hours = Math.floor(this.diffData / 3600000)
        this.minutes = Math.floor((this.diffData % 3600000) / 60000)
        this.seconds = Math.floor((this.diffData % 60000) / 1000)

        this.secondsElement.textContent = String(this.seconds).padStart(2, '0')
        this.minutesElement.textContent = String(this.minutes).padStart(2, '0')
        this.hoursElement.textContent = String(this.hours).padStart(2, '0')
    }

    bindEvents() {
        setInterval(this.startTimer, 1000)
    }
}

export default Timer;