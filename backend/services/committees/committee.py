from datetime import datetime
from typing import Any, Dict, List
from flask import Request
from models.committees import Committee, CommitteeTranslation
from services.committees.public.committee import get_committee_by_title
from utility.gc import upload_file
from utility.translation import get_translation
from utility.database import db


def update_committee(
    request: Request, committee_title: str, provided_languages: List[str]
) -> Dict[str, Any]:
    committee: Committee | None = get_committee_by_title(committee_title)

    if not committee:
        return {
            "success": False,
        }

    for index, language_code in enumerate(provided_languages):
        title = request.form.get(f"translations[{index}][title]")
        description = request.form.get(f"translations[{index}][description]")

        if not title and not description:
            continue

        committee_translation = get_translation(
            CommitteeTranslation,
            ["committee_id"],
            {"committee_id": committee.committee_id},
            language_code,
        )

        if committee_translation:
            if title:
                committee_translation.title = title

            if description:
                committee_translation.description = description

    db.session.flush()

    logo = request.files.get("logo")
    if logo:
        current_date = datetime.now().strftime("%Y-%m-%d")
        extension = logo.filename.split(".")[-1]
        url = upload_file(
            file=logo,
            file_name=f"{committee_title}_{current_date}.{extension}",
            path="committees",
            content_disposition="inline",
            content_type=logo.content_type,
            cache_control="public, max-age=31536000, immutable",
            timedelta=None,
        )

        committee.logo_url = url

    group_photo = request.files.get("group_photo")
    if group_photo:
        current_date = datetime.now().strftime("%Y-%m-%d")
        extension = group_photo.filename.split(".")[-1]
        url = upload_file(
            file=group_photo,
            file_name=f"{committee_title}_{current_date}.{extension}",
            path="committees/group_photos",
            content_disposition="inline",
            cache_control="public, max-age=31536000, immutable",
            content_type=group_photo.content_type,
        )

        committee.group_photo_url = url

    db.session.commit()

    return {
        "success": True,
    }
