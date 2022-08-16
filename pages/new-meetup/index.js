import { useRouter } from 'next/router';
import Head from 'next/head';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function newMeetup() {
  const router = useRouter();
  async function addMeetupHandler(newMeetupData) {
    const URL = '/api/new-meetup';
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(newMeetupData),
      headers: {
        'Content-Type': 'application/JSON',
      },
    });
    const data = response.json();
    console.log('response-data: ', data);
    router.push('/');
  }
  return (
    <>
      <Head>
        <title>Add New Meetup</title>
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />;
    </>
  );
}

export default newMeetup;
