import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import MeetupDetail from '../../components/meetups/MeetupDetail';

const password = encodeURIComponent('Mongo@677');
const URL = `mongodb+srv://mongongpdb:${password}@clusterngp0.7fcfxeh.mongodb.net/meetups?retryWrites=true&w=majority`;

function MeetupDetails(props) {
  const { title, image, address, description } = props.meetupData;
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <MeetupDetail
        title={title}
        image={image}
        address={address}
        description={description}
      />
    </>
  );
}

export async function getStaticPaths() {
  let meetups = {};
  try {
    const client = await MongoClient.connect(URL);
    const db = client.db();

    const meetupsCollections = db.collection('meetups');
    meetups = await meetupsCollections.find({}, { _id: 1 }).toArray();
    // console.log('data fetch:', meetups);
    client.close();
    // res.status(201).json({ message: 'Meetup inserted.' });
  } catch (error) {
    console.log(error);
  }
  return {
    fallback: false,
    // paths: [{ params: { meetupId: 'm1' } }, { params: { meetupId: 'm2' } }],
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  let meetupData = {};
  let meetupId = ObjectId(context.params?.meetupId);
  if (meetupId) {
    try {
      const client = await MongoClient.connect(URL);
      const db = client.db();

      const meetupsCollections = db.collection('meetups');
      // console.log('meetupId:', meetupId);
      meetupData = await meetupsCollections.findOne({ _id: meetupId });
      client.close();
    } catch (error) {
      console.log(error);
    }
  }

  // console.log('data fetch:', meetupData);
  return {
    props: {
      meetupData: {
        id: meetupData._id.toString(),
        title: meetupData.title,
        address: meetupData.address,
        description: meetupData.description,
        image: meetupData.image,
      },
    },
  };
}

export default MeetupDetails;
