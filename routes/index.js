const express = require('express');
const router = express.Router();
const Acticle = require('../models/article');

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
        url: 'https://localhost:3000/content',
        pageSizeLimit: 20, // 每页最大量
        frequencyLimit: 5, // 频率设置，并发限制
      }
    }
  })
});

router.get('/content', (req, res) => {
  (async () => {
    const { pageSize, latestId } = req.query;
    const match = {};
    if(latestId) match._id = {
      $gt1: latestId
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
          html: a.articleContentHtml,
          text: a.articleContent,
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
