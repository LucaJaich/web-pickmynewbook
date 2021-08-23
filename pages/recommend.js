import Head from "next/head";
import styles from "../styles/Recommend.module.css";
import React from "react";
import SearchBar from "../components/home/SearchBar";
import BookCard from "../components/recommended/BookCard";
import { useRouter, withRouter } from "next/router";
import ReactLoading from "react-loading";
import SearchForm from "../components/forms/SearchForm";
import { API_URL } from "../constants";

export default withRouter(
  class Home extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        basedOn: {},
        recommended: [],
      };
    }

    static async getInitialProps({ query }) {
      const { book_id } = query;
      if (book_id) {
        return { book_id };
      }
      return {};
    }

    handleCheckBox = (e) => {
      this.setState({ [e.target.name]: !this.state[e.target.name] });
    };

    getRecommended = () => {
      const book_id = this.props.router.query.book_id;
      const include_saga = this.props.router.query.include_saga;

      fetch(
        `${API_URL}/book-recommender/${book_id}?include_saga=${include_saga}`
      )
        .then((res) => res.json())
        .then((res) =>
          this.setState({
            basedOn: res.my_book,
            recommended: res.recommended.data.slice(0, 9),
            loading: false,
          })
        );
    };
    componentDidMount() {
      this.getRecommended();
    }

    render() {
      return (
        <div className={styles.container}>
          <Head>
            <title>Recommendations based on</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className={styles.mainHead}>
            {!this.state.loading ? (
              <>
                <div className={styles.centralContainer}>
                  <h1 className={styles.title}>
                    If you liked{" "}
                    <b className={styles.basedOnTitle}>
                      {this.state.basedOn.title.split(" (")[0]}
                    </b>
                    , you might also like these
                  </h1>
                  <SearchForm />
                </div>
              </>
            ) : (
              <h1 className={styles.title}>
                Loading the best recommendations for you 📚
              </h1>
            )}
          </div>
          {this.state.loading && (
            <ReactLoading color="#EFB035" width={"10vw"} />
          )}
          <main className={styles.bookContainer}>
            {this.state.recommended.map((book, i) => (
              <BookCard book={book} key={i} />
            ))}
          </main>
        </div>
      );
    }
  }
);
