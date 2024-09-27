import Head from 'next/head'
import DataReviewTable from "components/DataReviewTable";
import Navbar from 'components/navbar';



export default function Home() {
  return (
    <div>
      <Head>
        <title>Lume AI Data Review Assignment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <DataReviewTable />
    </div>
  );
}
