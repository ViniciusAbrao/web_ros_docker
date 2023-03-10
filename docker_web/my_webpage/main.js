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
        ros: null,
        rosbridge_address: 'ws://0.0.0.0:9090',
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
        // joystick valules
        joystick: {
            vertical: 0,
            horizontal: 0,
        },
        // publisher
        pubInterval: null,
        // subscriber data
        position: { x: 0, y: 0, z: 0, },
        orientation: { x: 0, y: 0, z: 0, w: 0, },
        lin_vel: { x: 0, y: 0, z: 0, },
        ang_vel: { x: 0, y: 0, z: 0, },
        subs_linear: 0.0,
        subs_angular: 0.0,
        ros_status: 100, //0 (communication closed), 1 (communication oppened), 2 (communication ended)
                         ///100 (web interface initialized), 4 (trying to connect), 99 (connection closed by node)
        db_status: 0, //0 (start communication with database), 1 (stop communication with database)
    },

    methods: {

        connect: function () {

            // define ROSBridge connection object
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })

            this.ros.on('connection', () => {

                console.log('Iniciou')
                this.logs.unshift((new Date()).toTimeString() + ' - Connected!')
                
                this.connected = true
                this.loading = false
                this.moveDisabled = true
                this.recordDisabled = true

                this.show_address= false
                this.show_options= true
                this.show_record= false
                this.show_move= false
                this.show_camera= true
                this.show_datalogger= false
                this.show_joystick= false
                this.show_menu= true

                this.setCamera()
                console.log('Connection to ROSBridge established!')

                let topic = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/odom',
                    messageType: 'nav_msgs/Odometry'
                })
                topic.subscribe((message) => {
                    this.position = message.pose.pose.position
                    this.orientation = message.pose.pose.orientation
                    this.lin_vel = message.twist.twist.linear
                    this.ang_vel = message.twist.twist.angular
                })
                
                let ros_status_topic = new ROSLIB.Topic({         
                    ros: this.ros,
                    name: '/parameter_status',
                    messageType: 'std_msgs/Int32'
                })
                ros_status_topic.subscribe((message) => {
                    this.ros_status = message.data
                    //console.log(message)
                }) 

                let db_status_topic = new ROSLIB.Topic({         
                    ros: this.ros,
                    name: '/db_communication',
                    messageType: 'std_msgs/Int32'
                })
                db_status_topic.subscribe((message) => {
                    this.db_status = message.data
                    //console.log(message)
                }) 

                let vel_topic = new ROSLIB.Topic({         
                    ros: this.ros,
                    name: '/cmd_vel',
                    messageType: 'geometry_msgs/Twist'
                })
                vel_topic.subscribe((message) => {
                    this.subs_linear = message.linear.x
                    this.subs_angular = message.angular.z
                }) 

                this.pubInterval = setInterval(this.publish, 100)

            })

            this.ros.on('error', (error) => {
                console.log('Something went wrong when trying to connect')
                console.log(error)
            })

            this.ros.on('close', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Disconnected!')
                this.sendCommand(0,0)
                this.subs_linear = 0
                this.subs_angular = 0

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

                this.ros_status = 100
                document.getElementById('divCamera').innerHTML = ''
                console.log('Connection to ROSBridge was closed!')
                clearInterval(this.pubInterval)
            })

        },

        publish: function () {

            //console.log(this.ros_status)

            if (this.ros_status == 4) {

                let topic = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/cmd_vel',
                    messageType: 'geometry_msgs/Twist'
                })
                let message_joystick = new ROSLIB.Message({
                    linear: { x: this.joystick.vertical, y: 0, z: 0, },
                    angular: { x: 0, y: 0, z: this.joystick.horizontal, },
                })
                topic.publish(message_joystick)

                this.recordDisabled = false

            }

            if (this.ros_status == 2) {

                this.stop_move()

                let topic = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/cmd_vel',
                    messageType: 'geometry_msgs/Twist'
                })
                let message_joystick = new ROSLIB.Message({
                    linear: { x: this.joystick.vertical, y: 0, z: 0, },
                    angular: { x: 0, y: 0, z: this.joystick.horizontal, },
                })
                topic.publish(message_joystick)
                this.recordDisabled = false

            }

            if (this.ros_status == 99) {
                this.disconnect()
            }

            if (this.ros_status == 100) { //this.ros_status == null || 

                //console.log('trying to connect')
                this.ros_status = 4
                let ros_status_topic = new ROSLIB.Topic({         
                    ros: this.ros,
                    name: '/parameter_status',
                    messageType: 'std_msgs/Int32'
                })
                let message_status = new ROSLIB.Message({
                    data: this.ros_status,
                })

                ros_status_topic.publish(message_status);
                
            }



        },

        disconnect: function () {
            
            this.stop_move()
            this.stop_record()
            this.sendCommand(0,0)
            this.subs_linear = 0
            this.subs_angular = 0

            this.ros_status = 2
            let ros_status_topic = new ROSLIB.Topic({         
                ros: this.ros,
                name: '/parameter_status',
                messageType: 'std_msgs/Int32'
            })
            let message_status = new ROSLIB.Message({
                data: this.ros_status,
            })
            ros_status_topic.publish(message_status);
            this.ros.close()

            
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

            this.db_status = 1
            let db_status_topic = new ROSLIB.Topic({         
                ros: this.ros,
                name: '/db_connection',
                messageType: 'std_msgs/Int32'
            })
            let message_db = new ROSLIB.Message({
                data: this.db_status,
            })
            db_status_topic.publish(message_db);

            this.recording = true
            this.moveDisabled = true

        },

        stop_record: function () {

            console.log('Stop Record')

            this.db_status = 0
            let db_status_topic = new ROSLIB.Topic({         
                ros: this.ros,
                name: '/db_connection',
                messageType: 'std_msgs/Int32'
            })
            let message_db = new ROSLIB.Message({
                data: this.db_status,
            })
            db_status_topic.publish(message_db);

            this.recording = false
            this.moveDisabled = false

        },

        start_move: function () {

            console.log('Start Move')

            this.ros_status = 1
            let ros_status_topic = new ROSLIB.Topic({         
                ros: this.ros,
                name: '/parameter_status',
                messageType: 'std_msgs/Int32'
            })
            let message_status = new ROSLIB.Message({
                data: this.ros_status,
            })
            ros_status_topic.publish(message_status);

            this.moving = true
            this.recordDisabled = true

        },

        stop_move: function () {

            console.log('Stop Move')

            this.ros_status = 2
            let ros_status_topic = new ROSLIB.Topic({         
                ros: this.ros,
                name: '/parameter_status',
                messageType: 'std_msgs/Int32'
            })
            let message_status = new ROSLIB.Message({
                data: this.ros_status,
            })
            ros_status_topic.publish(message_status);
            

            this.moving = false
            this.recordDisabled = false
            this.sendCommand(0,0)

        },

        sendCommand: function (vx,wz) {

            //console.log(vx,wz);
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            let message = new ROSLIB.Message({
                linear: { x: vx, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: wz, },
            })
            topic.publish(message)

        },

        startDrag() {
            this.dragging = true
            this.x = this.y = 0
        },

        stopDrag() {
            this.dragging = false
            this.x = this.y = 'no'
            this.dragCircleStyle.display = 'none'
            this.resetJoystickVals()
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

                this.setJoystickVals()
            }
        },

        setJoystickVals() {
            this.joystick.vertical = -1 * ((this.y / 200) - 0.5)
            this.joystick.horizontal = +1 * ((this.x / 200) - 0.5)
        },

        resetJoystickVals() {
            this.joystick.vertical = 0
            this.joystick.horizontal = 0
        },

        setCamera: function () {
            let viewer = new MJPEGCANVAS.Viewer({
                divID: 'divCamera',
                host: '0.0.0.0:8080',
                width: 320,
                height: 240,
                topic: '/camera/rgb/image_raw',
            })
        },

    },

    mounted() {
        // page is ready
        window.addEventListener('mouseup', this.stopDrag)
    },
    
})
