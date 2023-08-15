const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

// YouTube API key
const youtubeApiKey = 'AIzaSyCSxEEH9DjflJ1Czxk_wH6_zQWRlbtmT4E';

// MongoDB connection string
const mongoDbConnectionString = 'mongodb+srv://itzy_tracker:yeUa5UPL9xepkeao@cluster0.j8ss6uc.mongodb.net/?retryWrites=true&w=majority';

module.exports = async function (context, req) {
    try {
        // Fetch YouTube data
        const videoId = '6uZy86ePgO0';
        const youtubeResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet,statistics`);
        const videoData = youtubeResponse.data.items[0];

        // Prepare data to store in Cosmos DB
        const dataToStore = {
            videoId: videoData.id,
            title: videoData.snippet.title,
            views: videoData.statistics.viewCount,
            likes: videoData.statistics.likeCount,
            comments: videoData.statistics.commentCount,
            // Add more properties as needed
        };

        // Store data in Cosmos DB
        const client = new MongoClient(mongoDbConnectionString, { useNewUrlParser: true });
        await client.connect();
        const db = client.db('Cluster0');
        const collection = db.collection('customers');
        await collection.insertOne(dataToStore);

        // Close the database connection
        client.close();

        context.res = {
            status: 200,
            body: 'Data stored successfully'
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: 'An error occurred'
        };
    }
};
