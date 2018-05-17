const { MongoClient } = require('mongodb');
const logger = require('../utils/loggers/logger');
const { mongodb } = require('../setting');

switch(process.argv[2]) {
  case 'recalculate': 
    recalculateScore()
      .then(r => process.exit(0))
      .catch(e => {  
        logger.error('error in recalculating score');
      })
    break;
  default: 
    break;
}

async function recalculateScore() {
  const client = await MongoClient.connect(`mongodb://${mongodb.host}:${mongodb.port}`);
  const db = client.db(`${mongodb.database}`);
  const cursor = await db.collection('articles').find({}, { tags: 1 });

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const recaculatedTags = [];
    const titleExtracts = doc.tags.filter(t => t.name === 'Title_Extract')
      .sort((prev, next) => next.score - prev.score)
      .map((e, i, a) => {
        return {
          name: e.name,
          value: e.value,
          score: e.score / a[0].score,
        };
      });

    const tagNames = doc.tags.filter(t => t.name === 'TAGNAME')
      .map((t) => {
        return {
          name: t.name,
          value: t.value,
          score: 0.7,
        };
      });

    recaculatedTags.push(...titleExtracts);
    recaculatedTags.push(...tagNames);
    

    await db.collection('articles')
      .updateOne({ _id: doc._id }, { $set: { tags: recaculatedTags } });
  }
}

module.exports = {
  recalculateScore
}