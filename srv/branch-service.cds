using {bh as Branch} from '../db/Branch/Branch';


@path: '/Branch'

service BranchService
{
    entity Branchs as projection on Branch.Branch;
}