import React, { Component } from 'react'

class Header extends Component {

  render() {

    return (

      <header className="flex justify-center py-10 bg-grey-light">
        <h1 className="font-normal m-0 p-0">{this.props.title}</h1>
      </header>

    )
  }
}

export default Header
