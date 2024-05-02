from typing import Optional, TypedDict


class UMassLocationInfo(TypedDict):
    accepted_payment: str
    address: str
    breakfast_menu: str
    business_level: int
    closing_hours: str
    contact_information: str
    contact_information_plain: str
    dinner_menu: str
    distance: Optional[str]
    featured_image: str
    is_new: str
    livestream_entrance_link: Optional[str]
    livestream_entrance_text: Optional[str]
    livestream_seating_link: Optional[str]
    livestream_seating_text: Optional[str]
    location_id: int
    location_title: str
    location_url: str
    locations: str
    lunch_menu: str
    map_address: str
    moderate_level: str
    notbusy_level: str
    open_24: int
    opening_hours: str
    reservation_information: str
    reservation_information_plain: str
    short_description: str
    short_description_v2: str
    short_name: str


class UMassDish(TypedDict):
    allergens: str
    diet: str
    carbon_footprint: str
    dish_name: str
    ingredient_list: str
    serving_size: str
    calories: str
    calories_from_fat: str
    total_fat: str
    total_fat_dv: str
    sat_fat: str
    sat_fat_dv: str
    trans_fat: str
    cholesterol: str
    cholesterol_dv: str
    sodium: str
    sodium_dv: str
    total_carb: str
    total_carb_dv: str
    dietary_fiber: str
    dietary_fiber_dv: str
    sugars: str
    sugars_dv: str
    protein: str
    protein_dv: str
    diet_arr: list[str]
    price: str


class Dish(TypedDict):
    id: str
    name: str
    allergens: list[str]
    diet: list[str]
    carbon_footprint: str
    ingredient_list: str
    serving_size: str
    calories: Optional[float]
    calories_from_fat: Optional[float]
    total_fat_g: Optional[float]
    total_fat_g_dv: Optional[float]
    sat_fat_g: Optional[float]
    sat_fat_g_dv: Optional[float]
    trans_fat_g: Optional[float]
    cholesterol_mg: Optional[float]
    cholesterol_mg_dv: Optional[float]
    sodium_mg: Optional[float]
    sodium_mg_dv: Optional[float]
    total_carb_g: Optional[float]
    total_carb_g_dv: Optional[float]
    dietary_fiber_g: Optional[float]
    dietary_fiber_g_dv: Optional[float]
    sugars_g: Optional[float]
    sugars_g_dv: Optional[float]
    protein_g: Optional[float]
    protein_g_dv: Optional[float]
    price: Optional[float]
    avg_rating: Optional[float]
    my_rating: Optional[int]
    my_comment: Optional[str]


def dish_from_umass_dish(dish: UMassDish) -> Dish:
    field_grams = [
        "total_fat",
        "sat_fat",
        "trans_fat",
        "total_carb",
        "dietary_fiber",
        "sugars",
        "protein",
    ]
    field_mgs = ["cholesterol", "sodium"]
    field_floats = ["price", "calories", "calories_from_fat"]
    # from https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels
    DVs = {
        "total_fat_g": 78,
        "sat_fat_g": 20,
        "cholesterol_mg": 300,
        "sodium_mg": 2300,
        "total_carb_g": 275,
        "dietary_fiber_g": 28,
        "sugars_g": 50,
        "protein_g": 50,
    }
    ret = {
        "id": dish["dish_name"],
        "name": dish["dish_name"],
        "allergens": dish["allergens"].split(","),
        "diet": dish["diet_arr"],
        "carbon_footprint": dish["carbon_footprint"],
        "ingredient_list": dish["ingredient_list"],
        "serving_size": dish["serving_size"],
    }
    for key in field_floats:
        try:
            ret[key] = float(dish[key])
        except Exception:
            ret[key] = None
    for key in field_grams:
        try:
            ret[f"{key}_g"] = float(dish[key][:-1])
        except Exception:
            ret[f"{key}_g"] = None
    for key in field_mgs:
        try:
            ret[f"{key}_mg"] = float(dish[key][:-2])
        except Exception:
            ret[f"{key}_mg"] = None
    for key, DV in DVs.items():
        dv_key = key + "_dv"
        try:
            ret[dv_key] = round(ret[key] / DV * 100, 1)
        except Exception:
            ret[dv_key] = None
    return ret


class Preferences(TypedDict):
    allergens: list[str]


class User(TypedDict):
    email: str
    token: str
    name: str
    preferences: Preferences


class Review(TypedDict):
    dish_id: str
    user_email: str
    rating: int
    comment: Optional[str]
