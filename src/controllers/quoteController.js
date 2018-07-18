import Quote from '../models/Quote';

exports.quoteFindAll = (req, res) => {
  Quote.findAll()
    .then(quotes => {
      //console.log(`Quotes: ${JSON.stringify(quotes)}`);
      res.json(quotes);
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Find all failed.');
    });
};

exports.quoteFind = (req, res) => {
  Quote.findById(req.params.quoteId)
    .then(quote => {
      res.json(quote);
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
        json_attributes: req.body.json_attributes,
      })
      .save()
      .then(quote => {
        res.json(quote);
      })
      .catch(error => {
        console.error(error);
        res.status(400);
        res.send('Add failed.');
      });
  }
};

exports.quoteUpdate = (req, res) => {
  req.body.last_updated = Date.now();
  Quote.update(
    req.body,
    {
      where: {id: req.params.quoteId},
      returning: true,
      plain: true
    })
    .then(results => {
      res.json(results[1]);
    })
    .catch(error => {
      console.error(error);
      res.status(400);
      res.send('Update failed.');
    });
};

exports.quoteDelete = (req, res) => {
  Quote.destroy({
    where: { id: req.params.quoteId }
  })
  .then(deletedRecord => {
    console.log(`deleted: ${deletedRecord}`);
    if (!deletedRecord) {
      res.status(400);
      res.send('Delete failed.');
    } else {
      res.json({ deleted: deletedRecord});
    }
  });
};
