import sequelize from '../database/sequelize';
import Quote from '../models/Quote';
import QuoteFormat from '../models/QuoteFormat';
import QuoteCategory from '../models/QuoteCategory';
import Helper from '../modules/helper';
const helper = new Helper();

exports.quoteFindAll = (req, res) => {
  //Quote.findAll()
  sequelize.query('select * from quotesFindAll();')
    //.then(quotes => {
    .then(response => {
      //console.log(`Quotes: ${JSON.stringify(quotes)}`);
      //res.json(quotes);
      res.json(response[0]);
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Find all failed.');
    });
};

exports.quoteFind = (req, res) => {
  //Quote.findById(req.params.quoteId)
  sequelize.query(
    'select * from quotesFindById(:id);',
    {replacements: {id: req.params.quoteId}, type: sequelize.QueryTypes.SELECT}
  )
    .then(response => {
      res.json(response[0]);
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Find failed.');
    });
};

exports.quoteAdd = (req, res) => {
  if (!req.body.quote_string) {
    res.status(400);
    res.send('Quote is required');
  } else {
    const categoryid = (req.body.categoryid === 0 ? null : req.body.categoryid);
    Quote
      .build( {
        version: req.body.version,
        author_first_name: req.body.author_first_name,
        author_last_name: req.body.author_last_name,
        quote_string: req.body.quote_string,
        categoryid: categoryid,
        formatid: req.body.formatid,
        jsondata: createAttributes(req.body),
        createdat: Date.now()
      })
      .save()
      .then(quote => {
        res.json(parseAttributes(quote.dataValues));
      })
      .catch(error => {
        console.error(error);
        res.status(400);
        res.send('Add failed.');
      });
  }
};

function createAttributes(payload) {
  return {
    "comment": payload.comment,
    "graphic_url": payload.graphic_url,
    "source": payload.source
  };
}

function parseAttributes(quote) {
  quote.comment = quote.jsondata.comment;
  quote.graphic_url = quote.jsondata.graphic_url;
  quote.source = quote.jsondata.source;
  delete quote.jsondata;
  return quote;
}

exports.quoteUpdate = (req, res) => {
  const quote = req.body;
  quote.jsondata = createAttributes(req.body);
  Quote.update(
    req.body,
    {
      where: {id: req.params.quoteId},
      returning: true,
      plain: true
    })
    .then(results => {
      res.json(parseAttributes(results[1].dataValues));
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Update failed.');
    });
};

exports.quoteDelete = (req, res) => {
  const quoteId = req.params.quoteId;
  Quote.destroy({
    where: { id: req.params.quoteId }
  })
  .then(deletedRecord => {
    console.log(`deleted: ${deletedRecord}`);
    if (!deletedRecord) {
      res.status(400);
      res.send('Delete failed.');
    } else {
      res.json({ deleted: deletedRecord, id: quoteId});
    }
  });
};

// ===== FORMAT ===============================
exports.formatFindAll = (req, res) => {
  helper.tableFindAll(req, res, QuoteFormat, { order: [['name', 'ASC']] }, 'quote formats');
};

// ===== CATEGORIES ===============================
exports.categoryFindAll = (req, res) => {
  helper.tableFindAll(req, res, QuoteCategory, { order: [['name', 'ASC']] }, 'quote categories');
};

