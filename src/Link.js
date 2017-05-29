import React from 'react'
import { history } from '@jeffreznik/utils'
import withRouter from './withRouter'

const Link = ({ router, route, params = {}, children, className }) => {
  const path = router.getPath(route, params)

  const handleClick = e => {
    e.preventDefault()
    history.push(path)
  }

  return <a href={path} onClick={handleClick} className={className}>{ children }</a>
}

export default withRouter(Link)
