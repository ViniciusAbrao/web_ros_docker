
(cl:in-package :asdf)

(defsystem "my_package-msg"
  :depends-on (:roslisp-msg-protocol :roslisp-utils )
  :components ((:file "_package")
    (:file "Age" :depends-on ("_package_Age"))
    (:file "_package_Age" :depends-on ("_package"))
  ))