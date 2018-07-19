import sequelize from '../database/sequelize';
import Quote from '../models/Quote';

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
    Quote
      .build( {
        version: req.body.version,
        author_first_name: req.body.author_first_name,
        author_last_name: req.body.author_last_name,
        quote_string: req.body.quote_string,
        json_attributes: createAttributes(req.body)
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
    "category": payload.category,
    "comment": payload.comment,
    "graphic_url": payload.graphic_url,
    "quote_format": payload.quote_format,
    "source": payload.source
  };
}

function parseAttributes(quote) {
  quote.category = (quote.json_attributes.category ? quote.json_attributes.category : 0);
  quote.comment = quote.json_attributes.comment;
  quote.graphic_url = quote.json_attributes.graphic_url;
  quote.quote_format = (quote.json_attributes.quote_format ? quote.json_attributes.quote_format : 0);
  quote.source = quote.json_attributes.source;
  delete quote.json_attributes;
  return quote;
}

exports.quoteUpdate = (req, res) => {
  const quote = req.body;
  quote.json_attributes = createAttributes(req.body);
  quote.last_updated = Date.now();
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
