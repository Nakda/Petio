import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Api from "../data/Api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

class MovieCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onServer: false,
      imdbId: false,
      tmdbId: false,
      inView: false,
    };
    this.getMovie = this.getMovie.bind(this);
    this.card = React.createRef();
    this.inView = this.inView.bind(this);
  }

  componentDidMount() {
    // this.getMovie();
    this.inView();
  }

  componentDidUpdate() {
    if (!this.state.inView) {
      this.inView();
    }
  }

  inView() {
    const left = this.card.current.getBoundingClientRect().left;
    if (left <= this.props.width * 2) {
      this.setState({
        inView: true,
      });
      this.getMovie();
    }
  }

  getMovie() {
    let movie = this.props.movie;
    let id = movie.id;
    if (!this.props.api.movie_lookup[id]) {
      // check for cached
      if (!id) return false;
      Api.movie(id, true);
    }
  }

  render() {
    let id = this.props.movie.id;
    let movie = this.props.api.movie_lookup[id];
    if (!id || id === "false") {
      return null;
    }
    // Loading state
    if (!movie) {
      return (
        <div ref={this.card} key={id} data-key={id} className={"card type--movie-tv "}>
          <div className="card--inner">
            <Link to={`/movie/${id}`} className="full-link"></Link>
            <div className="image-wrap">
              <div className="no-poster"></div>
            </div>
            <div className="text-wrap">
              <p className="title">
                Loading...
                <span className="year"></span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    let img = movie.poster_path ? (
      <LazyLoadImage
        alt={movie.title}
        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        // effect="blur"
      />
    ) : (
      <div className="no-poster"></div>
    );
    // Final render
    return (
      <div ref={this.card} key={movie.id} data-key={movie.id} className={`card type--movie-tv ${movie.on_server ? "on-server" : ""} ${this.props.user.requests[movie.id] ? "requested" : ""}`}>
        <div className="card--inner">
          <Link to={`/movie/${movie.id}`} className="full-link"></Link>

          <div className="image-wrap">
            {this.props.popular_count ? <p className="popular-card--count">{this.props.popular_count}</p> : null}
            {img}
          </div>
          <div className="text-wrap">
            <p className="title" title={movie.title}>
              {movie.title}
              <span className="year">{this.props.character ? this.props.character : movie.release_date ? "(" + new Date(movie.release_date).getFullYear() + ")" : null}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

MovieCard = withRouter(MovieCard);

function MovieCardContainer(props) {
  return <MovieCard api={props.api} movie={props.movie} character={props.character} user={props.user} pos={props.pos} width={props.width} popular_count={props.popular_count} />;
}

const mapStateToProps = function (state) {
  return {
    api: state.api,
    user: state.user,
  };
};

export default connect(mapStateToProps)(MovieCardContainer);
