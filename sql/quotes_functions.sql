DROP FUNCTION quotesFindAll;

CREATE OR REPLACE FUNCTION quotesFindAll() RETURNS 
	TABLE(
		id integer,
		version integer,
		author_first_name text,
		author_last_name text,
		last_updated timestamp with time zone,
		quote_string text,
		category integer,
		comment text,
		graphic_url text,
		quote_format integer,
		source text
	) AS $$
	BEGIN
		RETURN QUERY 
		SELECT 
			quotes.id,
			quotes.version,
			quotes.author_first_name,
			quotes.author_last_name,
			quotes.last_updated,
			quotes.quote_string,
			cast(coalesce(json_attributes ->> 'category', '0') as integer) as category, 
			json_attributes ->> 'comment' as comment, 
			json_attributes ->> 'graphic_url' as graphic_url, 
			cast(coalesce(json_attributes ->> 'quote_format', '0') as integer) as quote_format, 
			json_attributes ->> 'source' as source 
		FROM quotes;
	END;
$$ LANGUAGE plpgsql;
