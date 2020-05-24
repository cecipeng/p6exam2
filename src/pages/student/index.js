import React from 'react'
import ReactDOM from 'react-dom'

// ====== Constant ====== //
import { ROLE } from '../../constant'

// ====== Components ====== //
import Blackboard from '../../components/blackboard'

ReactDOM.render(<Blackboard role={ ROLE.STUDENT } />, document.getElementById('root'))
