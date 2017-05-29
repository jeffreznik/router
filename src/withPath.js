import React from 'react'
import { history } from '@jeffreznik/utils'

const withPath = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props)

      this.updatePath = this.updatePath.bind(this)

      const currentPath = props.serverRequestPath || history.location.pathname
      const hash = typeof window === 'undefined' ? '' : history.location.hash.substring(1)

      this.state = { currentPath , hash }
      this.unlisten = null
    }
    componentDidMount() {
      this.unlisten = history.listen(this.updatePath)
    }
    componentWillUnmount() {
      this.unlisten()
    }
    updatePath(location) {
      this.setState({ currentPath: location.pathname, hash: location.hash.substring(1) })
    }
    render() {
      return <WrappedComponent path={this.state.currentPath} hash={this.state.hash} {...this.props} />
    }
  }
}

export default withPath
