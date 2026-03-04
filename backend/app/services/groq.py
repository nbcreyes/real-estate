from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

def generate_property_description(
    title: str,
    property_type: str,
    listing_type: str,
    bedrooms: int,
    bathrooms: int,
    area: float,
    city: str,
    state: str,
    price: float,
    extra_details: str = ""
) -> str:
    prompt = f"""
You are a professional real estate copywriter. Write a compelling, polished property listing description based on the details below. 
The description should be 3 to 4 sentences, highlight the best features, and appeal to potential buyers or renters.
Do not include the price in the description. Do not use bullet points. Write in a warm, professional tone.

Property details:
- Title: {title}
- Type: {property_type}
- Listing: For {listing_type}
- Bedrooms: {bedrooms}
- Bathrooms: {bathrooms}
- Area: {area} sqft
- Location: {city}, {state}
- Extra details: {extra_details if extra_details else "None"}

Write only the description, nothing else.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=300
    )
    return response.choices[0].message.content.strip()