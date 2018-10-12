DROP FUNCTION IF EXISTS menuBulkUpdate;

CREATE OR REPLACE FUNCTION menuBulkUpdate(nodes JSON[])
  RETURNS INTEGER AS $$

  DECLARE
    node json;
    id integer;
    labelStr text;
    parentid integer;
    pos integer;

  BEGIN

    FOREACH node IN ARRAY nodes
    LOOP
      id       := node->'id';
      labelStr := node->'label';
      labelStr := substring(labelStr, 2, char_length(labelStr)-2);
      parentid := node->'parentid';
      pos      := node->'itemposition';

      RAISE NOTICE 'node: id: %  label: %  parentid: %  pos: %' , id, labelStr, parentid, pos;
      EXECUTE 'UPDATE menuitems SET label = $2, parentid = $3, position = $4 WHERE id = $1'
      USING id, labelStr, parentid, pos;
    END LOOP;

    RETURN array_length(nodes, 1);
  END;
$$ LANGUAGE plpgsql;
