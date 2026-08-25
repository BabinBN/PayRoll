using {sync_data As sync} from '../db/Administration/Sync Data';

@path: '/service/sync'

service syncservice
{
    entity synced_date as projection on sync.sync_data;
}