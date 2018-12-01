DROP FUNCTION IF EXISTS metdata.pageFormsFindById;

CREATE OR REPLACE FUNCTION metadata.pageFormsFindById(idapp NUMERIC, idpage NUMERIC) RETURNS
	TABLE(
    appid integer,
		pageid integer,
		title varchar,
    formid integer,
    columnname varchar,
    formtitle varchar,
    formjson jsonb,
    pageactions json
   ) AS $$

  DECLARE
    actions JSON := metadata.pageFormsGetActionsByPage(idpage);

	BEGIN
		RETURN QUERY
		SELECT
      page.appid,
      page.id as pageid,
      page.title,
      pf.id as formid,
      pf.columnname,
      pf.title as formtitle,
      pf.jsondata as formjson,
      actions as pageactions
    FROM
      metadata.pages page
      LEFT OUTER JOIN
        (
          SELECT
            pf.pageid,
            pf.id,
            pf.systemcategoryid,
            col.columnname,
            pf.title,
            pf.jsondata
          FROM
            metadata.pageforms pf
            LEFT OUTER JOIN metadata.appcolumns as col ON pf.appcolumnid = col.id
        ) as pf
      ON
        pf.pageid = page.id
    WHERE
      page.appid = idapp AND page.id = idpage;
	END;
$$ LANGUAGE plpgsql;
