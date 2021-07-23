from models.models import ProductionFacility
from typing import List
import api.prtr_data as prtr_data
from api.conf import conf


facilities = prtr_data.load_facilities(conf.facilities_csv_fp)


def get_facilities(
    facility_id: str = None,
    skip: int = 0,
    limit: int = 10
) -> List[ProductionFacility]:
    if not facility_id:
        return facilities[skip:skip + limit]

    return [f for f in facilities if f.facilityInspireId == facility_id]
