import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

export default class JokeList extends React.Component{
  static defaultProps = { numJokesToGet: 10 };
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  /* get jokes if there are no jokes and until the if condition is
    statisfed   
 */

  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (error) {
      console.log(error);
    }
  }

  /* empty joke list and then call getJokes */

  generateNewJokes() {
    this.setState({ jokes: [] });
  }

  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    this.setState((st) => ({
      jokes: st.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    }));
  }

  /* render: either loading spinner or list of sorted jokes. */
  render() {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList" align="center">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.length < this.props.numJokesToGet ? (
             <p>Loading...........................</p>
          ) : null}
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      )
    }
}

