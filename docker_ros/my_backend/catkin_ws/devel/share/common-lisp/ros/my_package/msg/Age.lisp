; Auto-generated. Do not edit!


(cl:in-package my_package-msg)


;//! \htmlinclude Age.msg.html

(cl:defclass <Age> (roslisp-msg-protocol:ros-message)
  ((years
    :reader years
    :initarg :years
    :type cl:float
    :initform 0.0)
   (months
    :reader months
    :initarg :months
    :type cl:float
    :initform 0.0)
   (days
    :reader days
    :initarg :days
    :type cl:float
    :initform 0.0))
)

(cl:defclass Age (<Age>)
  ())

(cl:defmethod cl:initialize-instance :after ((m <Age>) cl:&rest args)
  (cl:declare (cl:ignorable args))
  (cl:unless (cl:typep m 'Age)
    (roslisp-msg-protocol:msg-deprecation-warning "using old message class name my_package-msg:<Age> is deprecated: use my_package-msg:Age instead.")))

(cl:ensure-generic-function 'years-val :lambda-list '(m))
(cl:defmethod years-val ((m <Age>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader my_package-msg:years-val is deprecated.  Use my_package-msg:years instead.")
  (years m))

(cl:ensure-generic-function 'months-val :lambda-list '(m))
(cl:defmethod months-val ((m <Age>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader my_package-msg:months-val is deprecated.  Use my_package-msg:months instead.")
  (months m))

(cl:ensure-generic-function 'days-val :lambda-list '(m))
(cl:defmethod days-val ((m <Age>))
  (roslisp-msg-protocol:msg-deprecation-warning "Using old-style slot reader my_package-msg:days-val is deprecated.  Use my_package-msg:days instead.")
  (days m))
(cl:defmethod roslisp-msg-protocol:serialize ((msg <Age>) ostream)
  "Serializes a message object of type '<Age>"
  (cl:let ((bits (roslisp-utils:encode-single-float-bits (cl:slot-value msg 'years))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) bits) ostream))
  (cl:let ((bits (roslisp-utils:encode-single-float-bits (cl:slot-value msg 'months))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) bits) ostream))
  (cl:let ((bits (roslisp-utils:encode-single-float-bits (cl:slot-value msg 'days))))
    (cl:write-byte (cl:ldb (cl:byte 8 0) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 8) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 16) bits) ostream)
    (cl:write-byte (cl:ldb (cl:byte 8 24) bits) ostream))
)
(cl:defmethod roslisp-msg-protocol:deserialize ((msg <Age>) istream)
  "Deserializes a message object of type '<Age>"
    (cl:let ((bits 0))
      (cl:setf (cl:ldb (cl:byte 8 0) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) bits) (cl:read-byte istream))
    (cl:setf (cl:slot-value msg 'years) (roslisp-utils:decode-single-float-bits bits)))
    (cl:let ((bits 0))
      (cl:setf (cl:ldb (cl:byte 8 0) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) bits) (cl:read-byte istream))
    (cl:setf (cl:slot-value msg 'months) (roslisp-utils:decode-single-float-bits bits)))
    (cl:let ((bits 0))
      (cl:setf (cl:ldb (cl:byte 8 0) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 8) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 16) bits) (cl:read-byte istream))
      (cl:setf (cl:ldb (cl:byte 8 24) bits) (cl:read-byte istream))
    (cl:setf (cl:slot-value msg 'days) (roslisp-utils:decode-single-float-bits bits)))
  msg
)
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql '<Age>)))
  "Returns string type for a message object of type '<Age>"
  "my_package/Age")
(cl:defmethod roslisp-msg-protocol:ros-datatype ((msg (cl:eql 'Age)))
  "Returns string type for a message object of type 'Age"
  "my_package/Age")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql '<Age>)))
  "Returns md5sum for a message object of type '<Age>"
  "e8088e290d061dabc94e1feafd4db363")
(cl:defmethod roslisp-msg-protocol:md5sum ((type (cl:eql 'Age)))
  "Returns md5sum for a message object of type 'Age"
  "e8088e290d061dabc94e1feafd4db363")
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql '<Age>)))
  "Returns full string definition for message of type '<Age>"
  (cl:format cl:nil "float32 years~%float32 months~%float32 days~%~%~%"))
(cl:defmethod roslisp-msg-protocol:message-definition ((type (cl:eql 'Age)))
  "Returns full string definition for message of type 'Age"
  (cl:format cl:nil "float32 years~%float32 months~%float32 days~%~%~%"))
(cl:defmethod roslisp-msg-protocol:serialization-length ((msg <Age>))
  (cl:+ 0
     4
     4
     4
))
(cl:defmethod roslisp-msg-protocol:ros-message-to-list ((msg <Age>))
  "Converts a ROS message object to a list"
  (cl:list 'Age
    (cl:cons ':years (years msg))
    (cl:cons ':months (months msg))
    (cl:cons ':days (days msg))
))
