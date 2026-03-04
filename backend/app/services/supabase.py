from supabase import create_client
from app.core.config import settings
import uuid

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def upload_image(file_bytes: bytes, content_type: str) -> str:
    filename = f"{uuid.uuid4()}.jpg"
    supabase.storage.from_("property-images").upload(
        path=filename,
        file=file_bytes,
        file_options={"content-type": content_type}
    )
    result = supabase.storage.from_("property-images").get_public_url(filename)
    return result