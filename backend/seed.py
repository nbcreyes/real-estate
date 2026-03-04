from app.db.database import SessionLocal
from app.models.user import User, UserRole
from app.models.agent import Agent
from app.models.property import Property, PropertyImage, ListingType, PropertyType, PropertyStatus
from app.core.security import hash_password

def seed():
    db = SessionLocal()

    try:
        if db.query(User).first():
            print("Database already seeded")
            return

        users = [
            User(name="Alice Morgan", email="alice@example.com", password=hash_password("password123"), role=UserRole.agent),
            User(name="James Carter", email="james@example.com", password=hash_password("password123"), role=UserRole.agent),
            User(name="Sofia Reyes", email="sofia@example.com", password=hash_password("password123"), role=UserRole.agent),
            User(name="John Buyer", email="john@example.com", password=hash_password("password123"), role=UserRole.buyer),
            User(name="Admin User", email="admin@example.com", password=hash_password("password123"), role=UserRole.admin),
        ]
        db.add_all(users)
        db.commit()

        agents = [
            Agent(user_id=users[0].id, bio="Top agent in New York with 10 years experience.", phone="555-1001", agency="Skyline Realty", rating=4.8, listings_count=12),
            Agent(user_id=users[1].id, bio="Specialist in luxury condos and downtown apartments.", phone="555-1002", agency="Urban Nest", rating=4.5, listings_count=8),
            Agent(user_id=users[2].id, bio="Family homes expert in the suburbs.", phone="555-1003", agency="Home Sweet Home Realty", rating=4.9, listings_count=15),
        ]
        db.add_all(agents)
        db.commit()

        properties = [
            Property(
                agent_id=agents[0].id, title="Modern Downtown Apartment", description="Sleek apartment in the heart of the city with stunning skyline views.",
                price=450000, type=ListingType.sale, property_type=PropertyType.apartment,
                bedrooms=2, bathrooms=2, area=1100, address="123 Main St", city="New York", state="NY",
                latitude=40.7128, longitude=-74.0060, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[0].id, title="Cozy Studio for Rent", description="Affordable studio in a prime location, perfect for young professionals.",
                price=1800, type=ListingType.rent, property_type=PropertyType.apartment,
                bedrooms=1, bathrooms=1, area=550, address="456 Broadway", city="New York", state="NY",
                latitude=40.7228, longitude=-74.0160, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[1].id, title="Luxury Condo with City Views", description="High-end condo with floor-to-ceiling windows and premium finishes.",
                price=1200000, type=ListingType.sale, property_type=PropertyType.condo,
                bedrooms=3, bathrooms=3, area=2200, address="789 Park Ave", city="New York", state="NY",
                latitude=40.7308, longitude=-73.9960, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[1].id, title="Downtown Loft for Rent", description="Spacious open-plan loft in a converted warehouse building.",
                price=3200, type=ListingType.rent, property_type=PropertyType.apartment,
                bedrooms=2, bathrooms=1, area=1400, address="321 West St", city="New York", state="NY",
                latitude=40.7408, longitude=-74.0080, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[2].id, title="Suburban Family Home", description="Beautiful 4-bedroom home with a large backyard, perfect for families.",
                price=750000, type=ListingType.sale, property_type=PropertyType.house,
                bedrooms=4, bathrooms=3, area=2800, address="12 Elm Street", city="Brooklyn", state="NY",
                latitude=40.6782, longitude=-73.9442, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[2].id, title="Charming Townhouse", description="Newly renovated townhouse with modern kitchen and private garden.",
                price=920000, type=ListingType.sale, property_type=PropertyType.house,
                bedrooms=3, bathrooms=2, area=1900, address="88 Oak Lane", city="Brooklyn", state="NY",
                latitude=40.6892, longitude=-73.9542, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[0].id, title="Vacant Land in Queens", description="Prime vacant lot ready for development in a fast-growing neighborhood.",
                price=300000, type=ListingType.sale, property_type=PropertyType.land,
                bedrooms=0, bathrooms=0, area=5000, address="500 Queens Blvd", city="Queens", state="NY",
                latitude=40.7282, longitude=-73.7949, status=PropertyStatus.active
            ),
            Property(
                agent_id=agents[1].id, title="Affordable 1BR Apartment", description="Well-maintained apartment close to public transit and shops.",
                price=1500, type=ListingType.rent, property_type=PropertyType.apartment,
                bedrooms=1, bathrooms=1, area=700, address="200 Flatbush Ave", city="Brooklyn", state="NY",
                latitude=40.6612, longitude=-73.9618, status=PropertyStatus.active
            ),
        ]
        db.add_all(properties)
        db.commit()

        images = [
            PropertyImage(property_id=properties[0].id, url="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", is_primary=True),
            PropertyImage(property_id=properties[1].id, url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", is_primary=True),
            PropertyImage(property_id=properties[2].id, url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", is_primary=True),
            PropertyImage(property_id=properties[3].id, url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", is_primary=True),
            PropertyImage(property_id=properties[4].id, url="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", is_primary=True),
            PropertyImage(property_id=properties[5].id, url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", is_primary=True),
            PropertyImage(property_id=properties[6].id, url="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", is_primary=True),
            PropertyImage(property_id=properties[7].id, url="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", is_primary=True),
        ]
        db.add_all(images)
        db.commit()

        print("Database seeded successfully")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()