drop function IF EXISTS menusFindAll;

create function menusfindall(idpermissions integer[])
    returns
        TABLE
        (
            id           integer,
            parentid     integer,
            label        varchar,
            routerpath   varchar,
            icon         varchar,
            appid        integer,
            pageid       integer,
            active       integer,
            helppath     varchar,
            itemposition integer,
            syspath      varchar,
            subitems     integer[]
        )
    language plpgsql as $$

DECLARE
--     userRoles integer[] := ARRAY []::integer[];
    user_role RECORD;
    user_roles CURSOR (id INTEGER) FOR SELECT * FROM app.getUserRoles(id);

begin
    raise NOTICE 'permissionids: %', idpermissions;

    --     IF (iduser IS NOT NULL) THEN
--         OPEN user_roles(iduser);
--         LOOP
--             FETCH user_roles INTO user_role;
--             EXIT WHEN NOT FOUND;
--             RAISE NOTICE 'roleid: %', user_role.roleid;
--             userRoles := array_append(userRoles, user_role.roleid);
--         END LOOP;
--     END IF;

    RETURN QUERY
        SELECT items.id,
               items.parentid,
               items.label,
               items.routerpath,
               (select icons.icon from menuicons icons where icons.id = items.iconid),
               items.appid,
               items.pageid,
               items.active,
               page.helppath,
               items.position                                                                    as itemposition,
               (select mp.syspath from menupaths mp where mp.id = items.pathid)         as syspath,
               array(select subs.id from menuitems subs where subs.parentid = items.id) as subitems
        FROM menuitems items
                 LEFT OUTER JOIN pages as page ON items.pageid = page.id
        WHERE items.pageid = 0
           OR (page.permissions is null OR page.permissions = '{}' OR page.permissions && idpermissions)
        ORDER BY syspath, itemposition;
END;
$$;

alter function menusFindAll OWNER TO gmarshall;
