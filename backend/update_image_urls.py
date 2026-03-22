from urllib.parse import urlparse

from app import create_app
from app.extensions import db
from app.models.pet import Pet
from app.models.service_provider import ServiceProvider

def _filename_from_path(path):
    return (path or "").split("/")[-1]


def rewrite_static_url(url):
    if not url:
        return None
    parsed = urlparse(url)
    path = parsed.path or ""
    filename = _filename_from_path(path)

    if path.startswith("/static/"):
        return path

    # Legacy postimg-hosted logos include the original filename.
    if filename.startswith("Logo-"):
        return f"/static/images/{filename}"
    return None


def run():
    app = create_app()
    with app.app_context():
        updates = 0

        for p in ServiceProvider.query.all():
            new_url = rewrite_static_url(p.img_url)
            if new_url and new_url != p.img_url:
                p.img_url = new_url
                updates += 1

            new_logo_url = rewrite_static_url(p.logo_url)
            if new_logo_url and new_logo_url != p.logo_url:
                p.logo_url = new_logo_url
                updates += 1

        for pet in Pet.query.all():
            new_url = rewrite_static_url(pet.img_url)
            if new_url and new_url != pet.img_url:
                pet.img_url = new_url
                updates += 1

        db.session.commit()
        print(f"Updated {updates} image URL(s).")


if __name__ == "__main__":
    run()
