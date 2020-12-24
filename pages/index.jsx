import Head from 'next/head';
import Button from '@material-ui/core/Button';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is the description of the index page" />
    </Head>

    <p>Content of Index</p>
    <Button variant="contained"> MUI button</Button>
  </div>
);

export default Index;
