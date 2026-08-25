namespace sync_data;
using {
    managed,
    cuid
} from '@sap/cds/common';


entity sync_data:cuid,managed{
    object_name:String(100);
    synced_date:Timestamp
}