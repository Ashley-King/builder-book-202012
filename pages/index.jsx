import PropTypes from 'prop-types';
import Head from 'next/head';
import withAuth from '../lib/withAuth';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  user: null,
};

class Index extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Settings</title>
          <meta name="description" content="List of purchased books." />
        </Head>
        <p>List of Purchased Books</p>
        <p>Email: {user.email}</p>
      </div>
    );
  }
}

Index.getInitialProps = async (ctx) => ({ user: ctx.query.user });

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default withAuth(Index);
