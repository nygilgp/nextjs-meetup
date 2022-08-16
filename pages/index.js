import Head from 'next/head';
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

const password = encodeURIComponent('Mongo@677');
const URL = `mongodb+srv://mongongpdb:${password}@clusterngp0.7fcfxeh.mongodb.net/meetups?retryWrites=true&w=majority`;

// const DUMMY_DATA = [
//   {
//     id: 'm1',
//     title: 'First meetup!',
//     image: 'https://source.unsplash.com/user/c_v_r/1900x800',
//     address: 'house no: 264, 1234 some city',
//     description: 'Yo.. our first meetup',
//   },
//   {
//     id: 'm2',
//     title: 'Second meetup!',
//     image: 'https://source.unsplash.com/user/c_v_r/1900x800',
//     address: 'house no: 264, 1234 some city',
//     description: 'Yo.. our second meetup',
//   },
// ];

function HomePage(props) {
  return (
    <>
      <Head>
        <title>All Meetups</title>
        <meta name="description" content="Browse the list of meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </>
  );
}

// runs on server side, not on build
// so values will always be latest and pages will be upto date
// export async function getServerSideProps(context) {
//   const req = context.req; // request
//   const res = context.res; // response
//   return {
//     props: {
//       meetups: DUMMY_DATA,
//     },
//   };
// }

// runs on buid and dev env
// Advantage of caching for 10sec or never rebuild at all
export async function getStaticProps() {
  // fetch data from API
  let meetups = [];
  try {
    const client = await MongoClient.connect(URL);
    const db = client.db();

    const meetupsCollections = db.collection('meetups');
    meetups = await meetupsCollections.find().toArray();
    client.close();
    // res.status(201).json({ message: 'Meetup inserted.' });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, // fetch data after 10s and regenrate the page in server
  };
}

export default HomePage;
