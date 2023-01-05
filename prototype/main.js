let vueApp = new Vue({

    el: "#vueApp",

    data: {
        //visibility
        show_address: true,
        show_options: false,
        show_record: false,
        show_move: false,
        show_camera: false,
        show_datalogger: false,
        show_joystick: false,
        show_menu: false,
        // ros connection
        rosbridge_address: '',
        connected: false,
        recording: false,
        moving:false,
        logs: [],
        loading: false,
        moveDisabled: true,
        recordDisabled: true,
        // page content
        menu_title: 'Connection',
        // dragging data
        dragging: false,
        x: 'no',
        y: 'no',
        dragCircleStyle: {
            margin: '0px',
            top: '0px',
            left: '0px',
            display: 'none',
            width: '75px',
            height: '75px',
        },

    },

    methods: {

        connect: function () {


            this.connected = true
            this.loading = false
            this.moveDisabled = true
            this.recordDisabled = false

            this.show_address= false
            this.show_options= true
            this.show_record= false
            this.show_move= false
            this.show_camera= true
            this.show_datalogger= false
            this.show_joystick= false
            this.show_menu= true

        },

        

        disconnect: function () {
            
            this.stop_move()
            this.stop_record()
            
            this.connected = false
            this.loading = false
            this.moveDisabled = true
            this.recordDisabled = true

            this.show_address= true
            this.show_options= false
            this.show_record= false
            this.show_move= false
            this.show_camera= false
            this.show_datalogger= false
            this.show_joystick= false
            this.show_menu= false
            
        },

        btn_teleop: function () {
            
            this.show_address= false
            this.show_options= true
            this.show_record= false
            this.show_move= false
            this.show_camera= true
            this.show_datalogger= false
            this.show_joystick= true
            this.show_menu= true

        },

        btn_monitore: function () {
            
            this.show_address= false
            this.show_options= true
            this.show_record= true
            this.show_move= false
            this.show_camera= true
            this.show_datalogger= true
            this.show_joystick= true
            this.show_menu= true

        },

        btn_replay: function () {
            
            this.show_address= false
            this.show_options= true
            this.show_record= false
            this.show_move= true
            this.show_camera= true
            this.show_datalogger= true
            this.show_joystick= false
            this.show_menu= true

        },

        start_record: function () {

            console.log('Start Record')

            this.recording = true
            this.moveDisabled = true

        },

        stop_record: function () {

            console.log('Stop Record')

            this.recording = false
            this.moveDisabled = false

        },

        start_move: function () {

            console.log('Start Move')

            this.moving = true
            this.recordDisabled = true

        },

        stop_move: function () {

            console.log('Stop Move')        

            this.moving = false
            this.recordDisabled = false


        },

        startDrag() {
            this.dragging = true
            this.x = this.y = 0
        },

        stopDrag() {
            this.dragging = false
            this.x = this.y = 'no'
            this.dragCircleStyle.display = 'none'
        },

        doDrag(event) {
            if (this.dragging) {
                this.x = event.offsetX
                this.y = event.offsetY
                let ref = document.getElementById('dragstartzone')
                this.dragCircleStyle.display = 'inline-block'

                let minTop = ref.offsetTop - parseInt(this.dragCircleStyle.height) / 2
                let maxTop = minTop + 200
                let top = this.y + minTop
                this.dragCircleStyle.top = `${top}px`

                let minLeft = ref.offsetLeft - parseInt(this.dragCircleStyle.width) / 2
                let maxLeft = minLeft + 200
                let left = this.x + minLeft
                this.dragCircleStyle.left = `${left}px`

            }
        },

    },

    mounted() {
        // page is ready
        window.addEventListener('mouseup', this.stopDrag)
    },
    
})
