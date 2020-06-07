DROP FUNCTION IF EXISTS menusFindAll;

CREATE FUNCTION menusfindall() RETURNS TABLE(id integer, parentid integer, label character varying, routerpath character varying, icon character varying, appid integer, pageid integer, active integer, itemposition integer, syspath character varying, subitems integer[])
    LANGUAGE plpgsql
    AS $$
	BEGIN
		RETURN QUERY
		SELECT
      items.id,
      items.parentid,
      items.label,
      items.routerpath,
      (select icons.icon from menuicons icons where icons.id = items.iconid),
      items.appid,
      items.pageid,
      items.active,
      items.position as itemposition,
      (select mp.syspath from menupaths mp where mp.id = items.pathid) as syspath,
      array(select subs.id from menuitems subs where subs.parentid = items.id) as subitems
		FROM menuitems items
    ORDER BY syspath, itemposition;
	END;
$$;
