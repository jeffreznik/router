import React from 'react'
import { history } from '@jeffreznik/utils'
import withRouter from './withRouter'
import classNames from 'classnames'

const Link = ({ router, route, params = {}, children, className }) => {
  const path = router.getPath(route, params)

  const handleClick = e => {
    e.preventDefault()
    history.push(path)
  }

  className = classNames(className, { active: router.isOnRoute(route) })

  return <a href={path} onClick={handleClick} className={className}>{ children }</a>
}

export default withRouter(Link)
