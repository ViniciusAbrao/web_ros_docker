;; Auto-generated. Do not edit!


(when (boundp 'my_package::Age)
  (if (not (find-package "MY_PACKAGE"))
    (make-package "MY_PACKAGE"))
  (shadow 'Age (find-package "MY_PACKAGE")))
(unless (find-package "MY_PACKAGE::AGE")
  (make-package "MY_PACKAGE::AGE"))

(in-package "ROS")
;;//! \htmlinclude Age.msg.html


(defclass my_package::Age
  :super ros::object
  :slots (_years _months _days ))

(defmethod my_package::Age
  (:init
   (&key
    ((:years __years) 0.0)
    ((:months __months) 0.0)
    ((:days __days) 0.0)
    )
   (send-super :init)
   (setq _years (float __years))
   (setq _months (float __months))
   (setq _days (float __days))
   self)
  (:years
   (&optional __years)
   (if __years (setq _years __years)) _years)
  (:months
   (&optional __months)
   (if __months (setq _months __months)) _months)
  (:days
   (&optional __days)
   (if __days (setq _days __days)) _days)
  (:serialization-length
   ()
   (+
    ;; float32 _years
    4
    ;; float32 _months
    4
    ;; float32 _days
    4
    ))
  (:serialize
   (&optional strm)
   (let ((s (if strm strm
              (make-string-output-stream (send self :serialization-length)))))
     ;; float32 _years
       (sys::poke _years (send s :buffer) (send s :count) :float) (incf (stream-count s) 4)
     ;; float32 _months
       (sys::poke _months (send s :buffer) (send s :count) :float) (incf (stream-count s) 4)
     ;; float32 _days
       (sys::poke _days (send s :buffer) (send s :count) :float) (incf (stream-count s) 4)
     ;;
     (if (null strm) (get-output-stream-string s))))
  (:deserialize
   (buf &optional (ptr- 0))
   ;; float32 _years
     (setq _years (sys::peek buf ptr- :float)) (incf ptr- 4)
   ;; float32 _months
     (setq _months (sys::peek buf ptr- :float)) (incf ptr- 4)
   ;; float32 _days
     (setq _days (sys::peek buf ptr- :float)) (incf ptr- 4)
   ;;
   self)
  )

(setf (get my_package::Age :md5sum-) "e8088e290d061dabc94e1feafd4db363")
(setf (get my_package::Age :datatype-) "my_package/Age")
(setf (get my_package::Age :definition-)
      "float32 years
float32 months
float32 days

")



(provide :my_package/Age "e8088e290d061dabc94e1feafd4db363")


