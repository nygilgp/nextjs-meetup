import { MongoClient } from 'mongodb';

const password = encodeURIComponent('Mongo@677');
const URL = `mongodb+srv://mongongpdb:${password}@clusterngp0.7fcfxeh.mongodb.net/meetups?retryWrites=true&w=majority`;

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log('send datat to mongo:');
    try {
      const client = await MongoClient.connect(URL);
      const db = client.db();

      const meetupsCollections = db.collection('meetups');
      await meetupsCollections.insertOne(data);
      client.close();
      res.status(201).json({ message: 'Meetup inserted.' });
    } catch (error) {
      console.log(error);
    }
  }
  return;
}

export default handler;
