import os
from urllib.parse import urlparse

from app import create_app
from app.extensions import db
from app.models.pet import Pet
from app.models.service_provider import ServiceProvider

IMAGE_BASE_URL = os.getenv("IMAGE_BASE_URL", "").rstrip("/")


def rewrite_static_url(url):
    if not url or not IMAGE_BASE_URL:
        return None
    parsed = urlparse(url)
    if parsed.path.startswith("/static/"):
        return f"{IMAGE_BASE_URL}{parsed.path}"
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

        for pet in Pet.query.all():
            new_url = rewrite_static_url(pet.img_url)
            if new_url and new_url != pet.img_url:
                pet.img_url = new_url
                updates += 1

        db.session.commit()
        print(f"Updated {updates} image URL(s).")


if __name__ == "__main__":
    run()
