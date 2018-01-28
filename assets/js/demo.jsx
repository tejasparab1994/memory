import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import classnames from 'classnames';

// Attribution: Completed the tic-tac-toe tutorial on https://reactjs.org/tutorial/tutorial.html
// Attribution: Completed the course: https://www.udemy.com/react-js-and-redux-mastering-web-apps/learn/v4/overview
//and may have used the ideas learnt from the courses.
export default function run_demo(root) {
  ReactDOM.render(<Game />, root);
}

class Square extends React.Component {
  "use strict";
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (!this.props.flipped) {
      this.props.checkMatch(this.props.value, this.props.id);
      this.props.checkScore(this.props.count);
    }
  }

  render() {
    var classes = classnames
    ('Square',
     {
      'Flipped': this.props.flipped,
    },
    { 'Matched': this.props.matched });
    var squareValue = this.props.flipped  ? this.props.value : '';
    return (
      <div className=  {classes} onClick={this.handleClick}>{squareValue}</div>
    );
  }
}

// functional component that gives the games initial values
function beginGame() {
  "use strict";
  return [
    // the matched and flipped components of individual squares
    { value: 'G', matched: false, flipped: false },
    { value: 'C', matched: false, flipped: false },
    { value: 'D', matched: false, flipped: false },
    { value: 'E', matched: false, flipped: false },
    { value: 'F', matched: false, flipped: false },
    { value: 'B', matched: false, flipped: false },
    { value: 'A', matched: false, flipped: false },
    { value: 'H', matched: false, flipped: false },
    { value: 'D', matched: false, flipped: false },
    { value: 'E', matched: false, flipped: false },
    { value: 'B', matched: false, flipped: false },
    { value: 'F', matched: false, flipped: false },
    { value: 'A', matched: false, flipped: false },
    { value: 'H', matched: false, flipped: false },
    { value: 'C', matched: false, flipped: false },
    { value: 'G', matched: false, flipped: false },
  ];
}

class Game extends React.Component{
  "use strict";
  constructor(props) {
    super(props);
    this.renderSquares = this.renderSquares.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
    this.checkScore = this.checkScore.bind(this);
    this.reset = this.reset.bind(this);

    // begin game with these values
    this.state = {
      squares: beginGame(),
      prevSquare: null, // previous square which was opened before the current
      locked: false, // square locked state, if flipped
      matches: 0,  // number of matches made currently, used for
      count: 0, // used to keep count of the clicks to maintain score
    };
  }

  checkMatch(value, id) {
    if (this.state.locked) { // to avoid clicking a third square when two already selected
      return;
    }

    var squares = this.state.squares; // get the square array
    squares[id].flipped = true; // the id of square that is flipped set to true
    this.setState({ squares, locked: true }); //lock the square
    if (this.state.prevSquare) { //if there is a square previously selected before this
      if (value === this.state.prevSquare.value) { //if both the values match then
        var matches = this.state.matches; // getting the matches number from state
        squares[id].matched = true; // getting the matched square id and setting it to true
        squares[this.state.prevSquare.id].matched = true; // setting previous square also as true
        this.setState({ squares, prevSquare: null, locked: false, matches: matches + 1 });
      } else { //if values do not match, then set timeout and then change locked status to false
        setTimeout(() => {
          squares[id].flipped = false;
          squares[this.state.prevSquare.id].flipped = false;
          this.setState({ squares, prevSquare: null, locked: false });
        }, 1000);
      }
    } else { //if there is no previous square, and locked status
      // false, set the current square as prevSquare
      this.setState({
        prevSquare: { id, value },
        locked: false,
      });
    }
  }

checkScore(count) {
  //update score if card is not flipped
  if (!this.state.locked) {
    //console.log(this.state.locked);
    this.setState({
      count: count + 1
    });
  } else {
    return;
  }
}



  reset() {
    var shuffled = beginGame();

    this.setState({
      // randomize the array values on Reset
      // Attribution: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      // got the idea for shuffle from here
      squares: shuffled.map((a) => [Math.random(), a]).sort((a,b) => a[0] - b[0]).map((a) => a[1]),
      prevSquare: null, // reseting value to null since no previous square
      locked: false, // reseting to default value
      matches: 0, // 0 matches on reset
      count: 0, // score back to zero
    });
  }

  renderSquares(squares) {
    return squares.map((square, index) => {
      return (

        // passing all the values to the square component
          <Square
            key={index}
            value={square.value}
            id={index}
            flipped={square.flipped}
            matched={square.matched}
            checkMatch={this.checkMatch}
            count={this.state.count}
            checkScore={this.checkScore}

          />
      );
    });
  }

  render() {

    var reset = 'Reset';
    if (this.state.matches === 8) {
      reset = 'You Win! Play Again?';
    }

    return (
      <div className="Game container-fluid">
        <div>
          <button className = "btn btn-danger" onClick={this.reset}>{reset}</button>
          <p className = "score"><b> Score:</b> {this.state.count}</p>
          <p className = "matched"><b> Matches:</b>{this.state.matches}</p>
        </div>

        <div className = "area-size">
          {this.renderSquares(this.state.squares)}
        </div>
      </div>
    );
  }
}
