const express = require('express');
const router = express.Router();
const Acticle = require('../models/article');
const Script = require('../scripts/adjustmentScore')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/spiderProtocol', (req, res) => {
  res.json({
    code: 0,
    protocol: {
      name: 'FULL_NET_SPIDER_PROTOCOL',
      version: '0.1'
    },
    config: {
      contentList: {
        url: 'https://localhost:2333/content',
        pageSizeLimit: 20, // 每页最大量
        frequencyLimit: 5, // 频率设置，并发限制
      }
    }
  })
});

router.get('/content', (req, res) => {
  (async () => {
    // Script.recaculatedTags();
    const { pageSize, latestId } = req.query;
    const match = {};
    if(latestId) match._id = {
      $gt: latestId
    }
    const articles = await Acticle.model
      .find(match)
      .sort({_id: 1})
      .limit(Number(pageSize) || 10);

    const contentList = articles.map(a => {
      return {
        title: a.title,
        contentType: 'dom',
        content: {
          // sourceId: String,
          html: a.content,
          // createdAt: { type: Number },
          // originCreatedAt: Number
        },
        tags: a.tags,
        contentId: a._id
      };
    });

    return { contentList }
  })()
    .then(r => {
      res.json(r);
    })
    .catch(e => {

    })
});

module.exports = router;
