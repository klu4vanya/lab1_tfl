(declare-const a1e Int) 
(declare-const a2e Int) 
(declare-const b1e Int) 
(declare-const b2e Int) 
(assert (>= a1e 0)) 
(assert (>= a2e 0)) 
(assert (>= b1e 0)) 
(assert (>= b2e 0)) 
(declare-const a1w Int) 
(declare-const a2w Int) 
(declare-const b1w Int) 
(declare-const b2w Int) 
(assert (>= a1w 0)) 
(assert (>= a2w 0)) 
(assert (>= b1w 0)) 
(assert (>= b2w 0)) 
(declare-const a1f Int) 
(declare-const a2f Int) 
(declare-const b1f Int) 
(declare-const b2f Int) 
(assert (>= a1f 0)) 
(assert (>= a2f 0)) 
(assert (>= b1f 0)) 
(assert (>= b2f 0)) 
(assert (and (or (and (or (> (* 000) (* a1w))(and (> (* 000) (* a2w))(= (* 000) (* a1w)))(and (> (* a1w) (* a2f))(= (* 000) (* a1w))(= (* 000) (* a2w)))(and (> (* a2w) (* a2e))(= (* 000) (* a1w))(= (* 000) (* a2w))(= (* a1w) (* a2f)))(and (> (* a2e) (* a2w))(= (* 000) (* a1w))(= (* 000) (* a2w))(= (* a1w) (* a2f))(= (* a2w) (* a2e)))) (or (>= (* 000) (* b1w))(and (>= (* 000) (* b2w))(= (* 000) (* b1w)))(and (>= (* b1w) (* a2f))(= (* 000) (* b1w))(= (* 000) (* b2w)))(and (>= (* b2w) (* a2e))(= (* 000) (* b1w))(= (* 000) (* b2w))(= (* b1w) (* a2f)))(and (>= (* a2e) (* a2w))(= (* 000) (* b1w))(= (* 000) (* b2w))(= (* b1w) (* a2f))(= (* b2w) (* a2e))))) (and (and (= (* 000) (* a1w))(= (* 000) (* a2w))(= (* a1w) (* a2f))(= (* a2w) (* a2e))(= (* a2e) (* a2w))) (or (> (* 000) (* b1w))(and (> (* 000) (* b2w))(= (* 000) (* b1w)))(and (> (* b1w) (* a2f))(= (* 000) (* b1w))(= (* 000) (* b2w)))(and (> (* b2w) (* a2e))(= (* 000) (* b1w))(= (* 000) (* b2w))(= (* b1w) (* a2f)))(and (> (* a2e) (* a2w))(= (* 000) (* b1w))(= (* 000) (* b2w))(= (* b1w) (* a2f))(= (* b2w) (* a2e))))))))