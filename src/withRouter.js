import React from 'react'
import PropTypes from 'prop-types'

const withRouter = WrappedComponent => {
  class WithRouter extends React.Component {
    render() {
      return <WrappedComponent router={this.context.router} {...this.props} />
    }
  }
  WithRouter.contextTypes = {
    router: PropTypes.object
  }
  return WithRouter
}

export default withRouter
