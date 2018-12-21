DROP FUNCTION IF EXISTS quotesfindbyid;

create function quotesfindbyid(findid integer)
  returns TABLE(
		id integer,
		version integer,
		author_first_name text,
		author_last_name text,
		updatedat timestamp with time zone,
		quote_string text,
		categoryid integer,
		formatid integer,
		comment text,
		graphic_url text,
		source text,
		formatname varchar,
		categoryname varchar
	)
language plpgsql
as $$
BEGIN
		RETURN QUERY
		SELECT
			quotes.id,
			quotes.version,
			quotes.author_first_name,
			quotes.author_last_name,
			quotes.updatedat,
			quotes.quote_string,
			quotes.categoryid,
			quotes.formatid,
			jsondata ->> 'comment' as comment,
			jsondata ->> 'graphic_url' as graphic_url,
			jsondata ->> 'source' as source,
      format.name as formatname,
      cat.name as categoryname
		FROM quotes
			LEFT OUTER JOIN quoteformats as format ON format.id = quotes.formatid
			LEFT OUTER JOIN quotecategories as cat ON cat.id = quotes.categoryid
		WHERE quotes.id = findId;
	END;
$$;
