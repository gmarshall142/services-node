DROP FUNCTION IF EXISTS menuitemadd;

create function menuitemadd(item json)
  returns integer
language plpgsql
as $$
DECLARE
    id_val integer;
    appid integer;
    parentid integer;
    pos integer;
    appname text;
    shortname text;

  BEGIN
    appid := item->'id';
    parentid := item->'parentid';
    pos := item->'position';
    appname := item->>'name';
    shortname := item->>'shortname';

    RAISE NOTICE 'appid: %  label: %  parentid: %  position: %  routerpath: %' , appid, appname, parentid, pos, shortname;

      EXECUTE 'INSERT INTO menuitems (id, appid, label, parentid, position, routerpath) VALUES' ||
              '(DEFAULT, ' || appid || ', ''' || appname || ''', ' || parentid || ', ' || pos ||', ''' || shortname || ''') ' ||
              'RETURNING menuitems.id;'
      INTO id_val;

    RETURN id_val;
  END;
$$;
