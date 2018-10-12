DROP FUNCTION IF EXISTS menuBulkAdd;

CREATE OR REPLACE FUNCTION menuBulkAdd(nodes JSON[])
  RETURNS INTEGER AS $$

  DECLARE
    node json;
    id text;
    labelStr text;
    parentid integer;
    pos integer;
    id_val integer;
    tmp text;

  BEGIN
    CREATE TEMP TABLE lookup(origid VARCHAR, id INTEGER);

    FOREACH node IN ARRAY nodes
    LOOP
      id       := node->'id';
      labelStr := node->'label';
      labelStr := substring(labelStr, 2, char_length(labelStr)-2);
      tmp      := node->'parentid';
      pos      := node->'itemposition';

      IF (tmp ~ '^([0-9]*)$') THEN
        parentid := CAST(tmp as integer);
      ELSE
        SELECT lookup.id INTO parentid FROM lookup WHERE lookup.origid = tmp;
      END IF;

      RAISE NOTICE 'node: id: %  label: %  parentid: %  pos: %' , id, labelStr, parentid, pos;
      EXECUTE 'INSERT INTO menuitems (id, label, parentid, position, routerpath) VALUES' ||
              '(DEFAULT, ''' || labelStr || ''', ' || parentid || ', ' || pos ||', ''undefined'') ' ||
              'RETURNING menuitems.id;'
      INTO id_val;

      INSERT INTO lookup (origid, id) VALUES (id, id_val);
    END LOOP;

    DROP TABLE lookup;

    RETURN array_length(nodes, 1);
  END;
$$ LANGUAGE plpgsql;
