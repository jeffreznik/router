import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'

class Router extends React.Component {
  constructor(props) {
    super(props)

    this.getCurrentPath = this.getCurrentPath.bind(this)
    this.getPath = this.getPath.bind(this)
    this.testPath = this.testPath.bind(this)
    this.getParams = this.getParams.bind(this)
    this.isOnRoute = this.isOnRoute.bind(this)
    this.push = this.push.bind(this)
    this.pushRoute = this.pushRoute.bind(this)
    this.replace = this.replace.bind(this)
    this.replaceRoute = this.replaceRoute.bind(this)

    this.state = this.getStateFromRoutes(props.routes)
  }
  
  getChildContext() {
    return { router: this }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromRoutes(nextProps.routes))
  }

  getStateFromRoutes(routes) {
    const newState = {
      routes: {},
      catchAllRoute: null,
    }

    for (const name in routes) {
      const { path, component, catchAll } = routes[name]

      // if path has a : in it, then it has params and needs regex to match, else a simple string test works
      let compiledPath, regexPath = null
      let paramNames = []
      if (path.indexOf(':') !== -1) {
        const keys = []
        compiledPath = pathToRegexp.compile(path)
        regexPath = pathToRegexp(path, keys)
        paramNames = keys.map(key => key.name)
      }

      newState.routes[name] = { path, component, compiledPath, regexPath, paramNames }
      if (catchAll) {
        newState.catchAllRoute = newState.routes[name]
      }
    }

    return newState
  }

  getCurrentPath() {
    return this.props.path
  }

  getPath(name, params = {}) {
    const route = this.state.routes[name]
    if (!route)
      return false
    if (route.compiledPath && params)
      return route.compiledPath(params)
    else if (!route.compiledPath)
      return route.path
    else
      return false
  }

  // returns true or false if path matches the named route
  testPath(name, path) {
    const route = this.state.routes[name]
    if (!route)
      return false
    if (route.regexPath)
      return route.regexPath.test(path)
    else
      return route.path === path
  }

  // returns true/false if the current path matches the named route
  isOnRoute(name) {
    return this.testPath(name, this.props.path)
  }

  getParams(name, path) {
    const route = this.state.routes[name]
    if (!route.paramNames.length) 
      return {}
    const match = route.regexPath.exec(path)
    if (!match)
      return {}
    const params = {}
    // matched params start at index 1
    for (let i = 1; i < match.length; i++) {
      params[route.paramNames[i - 1]] = match[i]
    }
    return params
  }

  // convenience methods to push/replace a new path
  push(path) {
    return this.props.history.push(path)
  }

  pushRoute(name, params = {}) {
    const path = this.getPath(name, params)
    if (path)
      return this.push(path)
    throw new Error('Could not find route', name, 'or invalid params specified')
  }

  replace(path) {
    return this.props.history.replace(path)
  }

  replaceRoute(name, params = {}) {
    const path = this.getPath(name, params)
    if (path)
      return this.replace(path)
    throw new Error('Could not find route', name, 'or invalid params specified')
  }

  render() {
    const { routes, catchAllRoute } = this.state
    const Layout = this.props.layout
    const path = this.props.path

    for (const name in routes) {
      if (this.testPath(name, path)) {
        const Component = routes[name].component
        const params = this.getParams(name, path)
        return (
          <Layout router={this} path={path}>
            <Component params={params} />
          </Layout>
        )
      }
    }
    if (catchAllRoute) {
      const CatchAllComponent = catchAllRoute.component
      return (
        <Layout router={this} path={path}>
          <CatchAllComponent />
        </Layout>
      )
    }
    throw new Error('No route defined for path')
  }
}

Router.childContextTypes = {
  router: PropTypes.object
}

export default Router
