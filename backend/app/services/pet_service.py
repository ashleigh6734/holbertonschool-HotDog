from app.models.pet import (
    Pet,
    SpeciesEnum,
    DogBreedEnum,
    CatBreedEnum,
    GenderEnum,
)
from app.models.user import User
from app.extensions import db
from datetime import date
import re


class PetService:

    @staticmethod
    def validate_breed_for_species(species, breed):
        """
        Check if breed matches the species
        """
        if species == SpeciesEnum.dog:
            allowed_breeds = [b.value for b in DogBreedEnum]
        elif species == SpeciesEnum.cat:
            allowed_breeds = [b.value for b in CatBreedEnum]
        else:
            raise ValueError("Unsupported species")

        if breed not in allowed_breeds:
            raise ValueError(f"Invalid breed '{breed}' for species '{species.value}'")

    @staticmethod
    def create_pet(owner_id, data):
        """
        Create new pet
        """
        species = SpeciesEnum(data["species"])
        gender = GenderEnum(data["gender"])
        breed = data["breed"]

        # Make sure breed matches species
        PetService.validate_breed_for_species(species, breed)

        # Optional DOB
        dob_raw = data.get("date_of_birth")

        if dob_raw in (None, "", "null"):
            dob = None
        else:
            try:
                dob = date.fromisoformat(dob_raw)
            except ValueError:
                raise ValueError("date_of_birth must be in YYYY-MM-DD format")

        pet = Pet(
            owner_id=owner_id,
            name=data["name"],
            species=species,
            breed=breed,
            gender=gender,
            desexed = data["desexed"],
            date_of_birth=dob,
            weight=data.get("weight"),
            notes=data.get("notes"),
        )

        db.session.add(pet)
        db.session.commit()
        return pet

    @staticmethod
    def get_pets_for_user(owner_id):
        """
        Return all pets belonging to a user
        """
        return Pet.query.filter_by(owner_id=owner_id).all()

    @staticmethod
    def get_pet_by_id(pet_id):
        """
        Fetch a pet by ID or raise 404
        """
        return Pet.query.get_or_404(pet_id)

    @staticmethod
    def update_pet(pet, data):
        """
        Update an existing pet
        """

        # Determine final species
        if "species" in data:
            final_species = SpeciesEnum(data["species"])
        else:
            final_species = pet.species

        # Determine final breed
        if "breed" in data:
            final_breed = data["breed"]
        else:
            final_breed = pet.breed

        # Validate breed against final species
        PetService.validate_breed_for_species(final_species, final_breed)

        # Assign species + breed
        pet.species = final_species
        pet.breed = final_breed

        # Gender
        if "gender" in data:
            pet.gender = GenderEnum(data["gender"])

        # Date of birth
        if "date_of_birth" in data:
            dob_raw = data["date_of_birth"]

            if dob_raw in (None, "", "null"):
                pet.date_of_birth = None
            else:
                try:
                    pet.date_of_birth = date.fromisoformat(dob_raw)
                except ValueError:
                    raise ValueError("date_of_birth must be in YYYY-MM-DD format")

        # Other simple fields
        for field in ["name", "desexed", "weight", "notes"]:
            if field in data:
                value = data[field]

                if field == "weight" and value not in (None, "", "null"):
                    value = float(value)

                setattr(pet, field, value)

        db.session.commit()
        return pet

    @staticmethod
    def delete_pet(pet):
        """
        Delete a pet
        """
        db.session.delete(pet)
        db.session.commit()

    @staticmethod
    def search_owner_and_pets(email=None, phone=None):
        if not email and not phone:
            raise ValueError("email or phone is required")

        query = User.query

        if email:
            query = query.filter(User.email == email.strip().lower())

        if phone:
            stripped = re.sub(r"[^\d+]", "", phone.strip())
            query = query.filter(User.phone_number == stripped)

        owner = query.first()
        if not owner:
            return None, []

        pets = Pet.query.filter_by(owner_id=owner.id).all()
        return owner, pets
