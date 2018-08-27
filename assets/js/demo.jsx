import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

// Attribution: Changed my react logic of hw03 in order to accomodate transferring control to elixir
//              through the approach suggested by Prof. in the email conversation with him on Saturday
// Attribution: Completed the tic-tac-toe tutorial on https://reactjs.org/tutorial/tutorial.html
// Attribution: Completed the course: https://www.udemy.com/react-js-and-redux-mastering-web-apps/learn/v4/overview
//and have used the ideas learnt from the courses.
export default function run_demo(root, channel) {
  ReactDOM.render(<Game channel={channel}/>, root);
}

// functional component Square
function Square(props){
    let classes = classnames({
      'Square': true,
      'Flipped': props.currentSquare != null, //This when square flipped, for different color
    });
    return (
      <button id={props.id} className={classes} onClick={()=>handleClick(props)}>
        {props.currentSquare}
      </button>
    );
}

//calls the function in game component which carries out the checking
function handleClick(props) {
  return props.checkMatch(props.id, props.currentSquare, props.flipped, props.count, props.locked);
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.channel = props.channel;
    this.checkMatch = this.checkMatch.bind(this);

    this.state = {
      currentSquare:[],
      flipped: false,
      count: 0, // used to keep count of the clicks to maintain score
      prevSquareid: null, // previous square which was opened before the current
      locked: false, // square locked state, if flipped
      matches: 0, // number of matches made currently, used for
    };

    this.channel.join()
      .receive("ok", this.gotView.bind(this))
      .receive("error", resp => { console.log("Unable to join", resp); });
  }

  gotView(view) {
  console.log("New view", view);
  //console.log("inside gotView")
  this.setState(view.game);
}

  renderSquare(props) {
    //console.log(props)
    //console.log(this.state.squares[props])
    //console.log(this.state.currentSquare[props])
    return (
      // passing all the values to the square component
      <Square
        id = {props}
        //value={this.state.squares[props]}
        currentSquare ={this.state.currentSquare[props]}
        flipped={this.state.flipped}
        count={this.state.count}
        locked={this.state.locked}
        checkMatch = {this.checkMatch}
      />
    );
  }

  checkMatch(id, currentSquare, flipped, count, locked){
    // to avoid clicking a third square when two already selected
    if(!locked && currentSquare == null) {
      this.channel.push("squareClick", {
        // passing the state information to channel as payload
        id: id,
        currentSquare: this.state.currentSquare,
        flipped: flipped,
        count: count,
        locked: this.state.locked,
        prevSquareid: this.state.prevSquareid,
        matches: this.state.matches,
      }).receive("ok", this.gotView.bind(this))
      // handling the timeout changes on getting a new view
      // which was previously done in react itself through setState
      // in the checkMatch function
        .receive("done", this.setTo.bind(this));
      }
    }

  setTo(view) {
    this.setState(view.game);
    setTimeout(() => {
      this.channel.push("to", {
        currentSquare: this.state.currentSquare,
        prevSquareid: this.state.prevSquareid,
      }).receive("ok", this.gotView.bind(this))
    }, 1000);
  }

  reset(){

    this.channel.push("reset",{})
                .receive("ok", this.gotView.bind(this))
  }

  render(){

    var reset = 'Reset';

    if(this.state.matches == 8) {
      reset = 'You Win! Play Again?';
    }

    return (
      <div className="Game container-fluid">
        <div className = "Buttons">
          <button className = "btn btn-danger" onClick={()=>this.reset()}>{reset}</button>
          <p className = "score"><b> Score:</b> {this.state.count}</p>
          <p className = "matched"><b> Matches:</b>{this.state.matches}</p>
        </div>
        <div className="area-size">
          <table className="squares">
            <tbody>
              <tr>
                <td>{this.renderSquare(0)}</td>
                <td>{this.renderSquare(1)}</td>
                <td>{this.renderSquare(2)}</td>
                <td>{this.renderSquare(3)}</td>
              </tr>
              <tr>
                <td>{this.renderSquare(4)}</td>
                <td>{this.renderSquare(5)}</td>
                <td>{this.renderSquare(6)}</td>
                <td>{this.renderSquare(7)}</td>
              </tr>
              <tr>
                <td>{this.renderSquare(8)}</td>
                <td>{this.renderSquare(9)}</td>
                <td>{this.renderSquare(10)}</td>
                <td>{this.renderSquare(11)}</td>
              </tr>
              <tr>
                <td>{this.renderSquare(12)}</td>
                <td>{this.renderSquare(13)}</td>
                <td>{this.renderSquare(14)}</td>
                <td>{this.renderSquare(15)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
