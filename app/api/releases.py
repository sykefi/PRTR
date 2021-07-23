from models.models import PollutantRelease
from typing import List
import api.prtr_data as prtr_data
from api.conf import conf


releases = prtr_data.load_releases(conf.releases_csv_fp)


def get_releases(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
) -> List[PollutantRelease]:
    if not facility_id:
        return releases[skip:skip + limit]

    return [r for r in releases if r.facilityInspireId == facility_id]
