import React, { Component } from "react"
import "./css/tailwind.css"
import moment from "moment-timezone"
import _ from "lodash"
import locations from "./data/locations.json"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowAltCircleUp,
  faArrowAltCircleDown,
  faHome
} from "@fortawesome/free-solid-svg-icons"
library.add(faArrowAltCircleUp, faArrowAltCircleDown, faHome)

class App extends Component {
  constructor(props) {
    super(props)
    const time = moment().format("X")
    this.state = {
      locations: locations,
      time: time,
      timerId: null,
      timeOffset: {
        days: 0,
        hours: 0,
        minutes: 0
      }
    }
  }

  handleClick = event => {
    let timeOffset = this.state.timeOffset
    switch (event.target.name) {
      case "dayUp":
        timeOffset.days++
        break
      case "dayDown":
        timeOffset.days--
        break
      case "hourUp":
        timeOffset.hours++
        break
      case "hourDown":
        timeOffset.hours--
        break
      case "minuteUp":
        timeOffset.minutes++
        break
      case "minuteDown":
        timeOffset.minutes--
        break
      case "amUp":
        timeOffset.hours += 12
        break
      case "amDown":
        timeOffset.hours -= 12
        break
      case "reset":
        timeOffset.days = 0
        timeOffset.hours = 0
        timeOffset.minutes = 0
        break
      default:
    }

    clearInterval(this.state.timerId)

    const timerId = setInterval(() => {
      this.setState({
        time: moment()
          .add(timeOffset.days, "days")
          .add(timeOffset.hours, "hours")
          .add(timeOffset.minutes, "minutes")
          .format("X"),
        timerId: timerId,
        timeOffset: timeOffset
      })
    }, 1000)
  }

  startTimer = () => {
    const timerId = setInterval(() => {
      const time = moment()
      this.setState({
        time: time.format("X"),
        timerId: timerId,
        timeOffset: {
          days: 0,
          hours: 0,
          minutes: 0
        }
      })
    }, 1000)
  }

  componentDidMount() {
    this.startTimer()
  }

  render() {
    let time = this.state.time
    let timer = moment.unix(this.state.time)

    let columnData = _.chunk(
      this.state.locations,
      Math.ceil(this.state.locations.length / 2)
    )

    const styleSecondHand = {
      transform: "rotate(" + timer.format("ss") * 6 + "deg)",
      position: "absolute"
    }

    const styleMinuteHand = {
      transform: "rotate(" + timer.format("mm") * 6 + "deg)",
      position: "absolute"
    }

    const styleHourHand = {
      transform: "rotate(" + timer.format("h") * 30 + "deg)",
      position: "absolute"
    }

    return (
      <div className="bg-grey-lightest">
        <Header title="World Time Manipulator" />
        <div className="flex  justify-center bg-grey-lightest mt-2">
          <TimeBarButton
            width="w-16"
            timeUnit="reset"
            handleClick={this.handleClick}
          />
          <TimeBarWidget
            width="w-1/4"
            timeUnit="day"
            handleClick={this.handleClick}
            timer={timer}
            output={timer.format("ddd MMM D")}
          />
          <TimeBarWidget
            width="w-32"
            timeUnit="hour"
            handleClick={this.handleClick}
            timer={timer}
            output={timer.format("h")}
          />
          <TimeBarWidget
            width="w-64"
            timeUnit="minute"
            handleClick={this.handleClick}
            timer={timer}
            output={timer.format("mm:ss")}
          />
          <TimeBarWidget
            width="w-42"
            timeUnit="am"
            handleClick={this.handleClick}
            timer={timer}
            output={timer.format("A")}
          />
        </div>
        <div className=" flex justify-center">
          <AnalogClock time={timer} />
        </div>
        <WorldTimePanel locations={this.state.locations} time={timer} />
        <Footer />
      </div>
    )
  }
}

const TimeBarWidget = ({ width, timeUnit, handleClick, timer, output }) => {
  return (
    <div
      className={
        "text-4xl  flex items-center text-center  border border-grey-dark  m-1 bg-grey-lightert font-bold " +
        width
      }
    >
      <div className="w-6 pb-2  px-2 ">
  
        <button
          name={timeUnit + "Up"}
          onClick={handleClick}
          className="focus:outline-none  text-grey hover:text-blue-lighter"
        >
          <FontAwesomeIcon
            icon="arrow-alt-circle-up"
            name={timeUnit + "Up"}
            className=" text-2xl w-full"
            onClick={handleClick}
          />
        </button>

        <button
          name={timeUnit + "Down"}
          onClick={handleClick}
          className="focus:outline-none  text-grey hover:text-blue-lighter"
        >
          <FontAwesomeIcon
            icon="arrow-alt-circle-down"
            name={timeUnit + "Down"}
            className="text-2xl w-full"
            onClick={handleClick}
          />
        </button>
      </div>
      <div className="w-full flex justify-center px-3 ">{output}</div>
    </div>
  )
}

const TimeBarButton = ({ width, timeUnit, handleClick, timer, output }) => {
  return (
    <div
      className={
        "flex  justify-center items-center border border-grey-dark m-1 bg-grey-lighter " +
        width
      }
    >
      <button
        name={timeUnit}
        onClick={handleClick}
        className=" focus:outline-none  text-grey hover:text-blue-lighter"
      >
        <FontAwesomeIcon icon="home" className=" text-3xl w-full"   onClick={handleClick} />
      </button>
    </div>
  )
}

const WorldTimeColumn = ({ locationsColumn, baseTime }) => {
  return (
    <ul className=" w-2/5  ">
      {locationsColumn.map(location => (
        <li className="flex  items-center border-b">
          <div className="w-32 text-center px-8 py-2">
            {
              <img
                src={require("./images/" + location.image + ".png")}
                alt="flag"
              />
            }
          </div>
          <div className="w-64  text-2xl font-bold  ">{location.city}</div>
          <div className=" text-2xl font-bold text-grey-darker ">
            {baseTime.tz(location.timezone).format("ddd h:mm A")}
          </div>
        </li>
      ))}
    </ul>
  )
}

const WorldTimePanel = ({ locations, time }) => {
  const columnData = _.chunk(locations, Math.ceil(locations.length / 2))
  return (
    <div className="flex justify-center pt-4">
      <WorldTimeColumn locationsColumn={columnData[0]} baseTime={time} />
      <WorldTimeColumn locationsColumn={columnData[1]} baseTime={time} />
    </div>
  )
}

const AnalogClock = ({ time }) => {
  const styleSecondHand = {
    transform: "rotate(" + time.format("ss") * 6 + "deg)",
    position: "absolute"
  }
  const styleMinuteHand = {
    transform: "rotate(" + time.format("mm") * 6 + "deg)",
    position: "absolute"
  }
  const styleHourHand = {
    transform: "rotate(" + time.format("h") * 30 + "deg)",
    position: "absolute"
  }
  return (
    <div className="flex justify-center w-64  h-64 relative border-b my-2">
      <img className="w-full relative" src={require("./images/clock.png")} />
      <img
        className="w-full time"
        style={styleHourHand}
        src={require("./images/hourHand.png")}
      />
      <img
        className="w-full time"
        style={styleMinuteHand}
        src={require("./images/minuteHand.png")}
      />
      <img
        className="w-full time"
        style={styleSecondHand}
        src={require("./images/secondHand.png")}
      />
    </div>
  )
}
export default App
