DROP FUNCTION IF EXISTS menuBulkDelete;

CREATE OR REPLACE FUNCTION menuBulkDelete(nodes JSON[])
  RETURNS INTEGER AS $$

  DECLARE
    node json;
    delid integer;
    labelStr text;
    parentid integer;

  BEGIN
    FOREACH node IN ARRAY nodes
    LOOP
      delid    := node->'id';
      labelStr := node->'label';
      labelStr := substring(labelStr, 2, char_length(labelStr)-2);
      parentid := node->'parentid';

      RAISE NOTICE 'node: id: %  label: %  parentid: %' , delid, labelStr, parentid;
      DELETE FROM metadata.menuitems where menuitems.id = delid;

    END LOOP;

    RETURN array_length(nodes, 1);
  END;
$$ LANGUAGE plpgsql;
