from .models import CarModel, CarMake


def initiate():
    car_make_data = [
        {"name": "Nissan", "description": "Japanese Car Manufacturer"},
        {"name": "Merzedes", "description": "German Car Manufacturer"},
        {"name": "Audi", "description": "German Car Manufacturer"},
        {"name": "Kia", "description": "Korean Car Manufacturer"},
        {"name": "Toyota", "description": "Japanese Car Manufacturer"},
    ]

    car_make_intances = []
    for data in car_make_data:
        car_make_intances.append(CarMake.objects.create(name=data["name"],\
                                         description=data["description"]))

    car_model_data = [
        {"name": "Pathfinder", "car_type": "SUV", "year": 2025,\
          "car_make": car_make_intances[0]},
        {"name": "Qashqai", "car_type": "SUV", "year": 2020, \
         "car_make": car_make_intances[0]},
        {"name": "Altima", "car_type": "Sedan", "year": 2021, \
         "car_make": car_make_intances[0]},
        {"name": "XTRAIL", "car_type": "SUV", "year": 2023, \
         "car_make": car_make_intances[0]},
        {"name": "A-class", "car_type": "SUV", "year": 2025, \
         "car_make": car_make_intances[1]},
        {"name": "C-class", "car_type": "SUV", "year": 2020, \
         "car_make": car_make_intances[1]},
        {"name": "GLA", "car_type": "SUV", "year": 2021, \
         "car_make": car_make_intances[1]},
        {"name": "E-class", "car_type": "SUV", "year": 2023, \
         "car_make": car_make_intances[1]},
        {"name": "A4", "car_type": "SUV", "year": 2020, \
         "car_make": car_make_intances[2]},
        {"name": "A5", "car_type": "SUV", "year": 2025, \
         "car_make": car_make_intances[2]},
        {"name": "A6", "car_type": "SUV", "year": 2023, \
         "car_make": car_make_intances[2]},
        {"name": "A7", "car_type": "SUV", "year": 2021, \
         "car_make": car_make_intances[2]},
        {"name": "Sorrento", "car_type": "SUV", "year": 2020, \
         "car_make": car_make_intances[3]},
        {"name": "Carnival", "car_type": "SUV", "year": 2023, \
         "car_make": car_make_intances[3]},
        {"name": "Sportage", "car_type": "SUV", "year": 2021, \
         "car_make": car_make_intances[3]},
        {"name": "Cerato", "car_type": "SUV", "year": 2025, \
         "car_make": car_make_intances[3]},
        {"name": "Corella", "car_type": "SUV", "year": 2020,\
         "car_make": car_make_intances[4]},
        {"name": "Camry", "car_type": "SUV", "year": 2025, \
         "car_make": car_make_intances[4]},
        {"name": "Hilux", "car_type": "SUV", "year": 2023, \
         "car_make": car_make_intances[4]},
        {"name": "Kluger", "car_type": "SUV", "year": 2021, \
         "car_make": car_make_intances[4]},
    ]

    for data in car_model_data:
        CarModel.objects.create(
            name=data["name"],
            car_type=data["car_type"],
            year=data["year"],
            car_make=data["car_make"]
        )
