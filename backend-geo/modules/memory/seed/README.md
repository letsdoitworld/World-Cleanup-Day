# Area data

This folder defines geographical areas.

## File purpose and naming

Each area is defined as a JSON file. Each file MUST contain a single area.

The name of each file consists of a series of HASC ISO2 area codes separated by dots and ending with `.json`. Each HASC code is a two-letter code that uniquely identifies the sub-area within the parent area. Example: for the Alba county of country Romania the file name would be called `RO.AB.json`. These codes are usually provided with any GIS data.

## File content structure

The JSON structure is the following:

```
{
    "code": "RO.AB",
    "name": "Alba",
    "geometry": {
        "type":"Polygon","coordinates":[]
    },
    "parent":"RO"
}
```

Description:

* `code`: The sequence of HASC codes described above (same as the file name, without `.json`).
* `name`: The name of the area.
* `geometry`: A valid GeoJSON geometry definition (most likely of type "Polygon" or "MultiPolygon").
* `parent`: HASC sequence identifying the parent area of this one. This is optional and should be provided ONLY if the parent area is also present. For example, if you want to define the San Francisco area (`US.CA.SF`) but not the United States (`US`) or California (`US.CA`), you would not add a `parent` property in the `US.CA.SF.json` file.

## File loading and use

These files are all read whenever the `backend-geo` and `backend-db` services are starting.

### backend-geo

The `backend-geo` service parses the entire folder and loads all areas in memory. It will signal when it has finished loading them through a promise. Once ready, it provides an endpoint that list all areas, and one that determines in which area a set of longitude/latitude coordinates falls into.

### backend-db

The `areas` plugin of the `backend-db` service periodically retries once a second to connect to `backend-geo`. Once connected, it will retrieve all areas known to `geo` and compare them to the `areas/` database (see `db.seedAreas()`). If there are areas known to `geo` that are not in the database, it will insert them.

It does NOT automatically delete database areas that are not known to `geo`.

It does NOT automatically compare and update database areas that may have changed in the files.

## How area data is used in the database

### Area database

Areas are loaded to the database without geometry data, because geometry matching is done by the `backend-geo` service.

Should this change in the future (eg. CouchDB gains functional polygon search capabilities), the geometry data should be loaded to database as well.

Several other fields are added, such as update timestamps.

The HASC sequence (eg. `RO.AB`) is used as unique ID, and the `parentId` field, if present, is expected to match such an ID. CouchDB does not provide referential integrity, and failure to comply with this requirement will result in erroneous behavior. The burdain falls therefore on making sure that the JSON files mentioned above contain correct references.

An area document without a `parentId` field will be considered a "top-level" area. This does NOT mean it is a country; there are all kinds of reasons for which a lower-level area might be added and not subordinated to a parent area.

Please note that the areas represent extraneous metadata as far as data entities such as trashpoints or users are concerned. In other words, while trashpoints or users are core data (the application cannot function without them), area metadata should be considered optional.

### Trashpoints vs areas

A trashpoint MAY contain a field called `areas` which is an array of HASC sequences that identifies areas in which the current coordinates of the trashpoint fall into.

Updating the trashpoint data will always attempt to refresh the `areas` field by requesting an area search from the `backend-geo` service.

This field is used by several API endpoints to filter trashpoints by a specific area, or to count trashpoints that fall into an area.

### User accounts vs areas

Each user account can optionally have a `country` field, which is a HASC code. Updating this field is currently done voluntarily by the user in the mobile app. Once the user has filled their country it cannot be deleted, only changed.

This field is used to filter accounts in the administrative view and to limit the permissions of area leaders only to accounts that have a `country` matching one of the areas they lead.

### Area leaders vs areas

Area leaders are user accounts bearing the `leader` type. These accounts have access to the administrative interface and have permission to perform certain operations on lesser accounts (type `volunteer`).

An area leader is created by taking a regular `volunteer` account and assigning it as the leader of an area. This can only be done by `superadmin` accounts (which cannot become area leaders). The same account can be leader for more than one area. An area cannot have more than one leader. Once an account has been removed as leader from any area, it will revert to a regular account (type `volunteer`).

Assigning a leader is done in the database via the optional area field `leaderId`, which contains an account ID.

When an account is assigned as area leader, it gains administrative powers over all users that have filled their `country` field with a country code matching one of the leader's areas.

Please note that this match is done only on the top-level HASC code, and that a leader assigned to a sub-area will still have administrative powers over all users with that `country` code. Example: the leader for `RO.AB` can administer all users with `country` set to `RO`.

There is no relation between an area leader's `country` account field and the areas they are assigned to as leaders.

## Deleting areas

Whether areas are deleted from the JSON files has no effect on the database data.

Removing areas from the database should be done directly in the database, by removing the `areas` document with the corresponding `_id`.

In general, areas were not meant to be deleted once added, but should it be necessary it can be done with minimal impact, once the following points are observed:

* Care should be taken to make sure that there are no other areas pointing to it via their `parentId` field. If that is the case, those areas should be modified manually to preserve consistency.
* If an area leader was assigned to the deleted area, their status should be modified to reflect that they stop being the leader, which may revert them to regular account (if they have no other areas assigned). The best way to accomplish this is to have a `superadmin` unassign the account from the area to be deleted _before_ that happens.
* Last but not least, trashpoints that listed the deleted area in their `areas` field should be updated (via the corresponding API endpoint) so they refresh that information.

## Modifying areas

Certain parts of an area's data take better to modifications than others.

### Modifying the HASC sequence

Modifying an area's HASC sequence, which serves as its unique identifier as well as for parent-offspring references, is obviously a more complicated undertaking than others. The following points should be observed:

* Treat it as an area deletion and see all the points listed above under "deleting an area".
* Make sure that the new HASC sequence is consistently represented in both the area's file name and `code` field, as well as in `parent` field references in other files.

Once the `backend-geo` and `backend-db` services are restarted the new area will be loaded to the database and can be used.

### Modifying the area name

A changed name will not be automatically updated in the database.

(As a side note, the `db.seedAreas()` function _could_ be modified to perform this modification, with minimal impact. This function is called whenever the `backend-db` service is restarted.)

For the time being, it is most simple to perform the modification manually in both the JSON file and the database.

### Modifying the parent

A changed area parent will not be automatically updated in the database.

Care should be taken that the references remain consistent between areas following this modification.

The simplest approach is to perform this modification manually in both the JSON file and the database.

Otherwise, removing, changing or adding an area's parent should have minimal impact, once the `backend-geo` and `backend-db` services are restarted and the administrative interface is refreshed.

### Modifying the geometry

Modifying an area's geometry will have a potential impact on whether certain trashpoints` `areas` list should be updated.

This will happen automatically whenever a trashpoint is updated.

## Bulk-updating trashpoint areas

Each trashpoints maintains in their `areas` field a list of areas in which it falls into, according to their current coordinates.

This list is updated whenever the trashpoint is updated.

However, when areas are added, deleted or modified, there is no mechanism for bulk-updating the list of every trashpoint.

If such a mechanism is needed, one could be devised by finding trashpoints in need of update. You can either use an API endpoint that filters trashpoints by area, or an API endpoint that filters trashpoints by geographical rectangle (using the bounding box of the deleted area as the rectangle); then issue an update for each of these trashpoints.
