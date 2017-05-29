import React from 'react'

const withRouter = WrappedComponent => {
  class WithRouter extends React.Component {
    render() {
      return <WrappedComponent router={this.context.router} {...this.props} />
    }
  }
  WithRouter.contextTypes = {
    router: React.PropTypes.object
  }
  return WithRouter
}

export default withRouter
