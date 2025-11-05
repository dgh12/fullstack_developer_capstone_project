"""djangoapp views"""

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse
import logging
import json
from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
# from django.contrib import messages
# from datetime import datetime
from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import csrf_exempt
from .restapis import get_request, analyze_review_sentiments, post_review
from .populate import initiate
from .models import CarModel, CarMake


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    """Handle login request"""
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)


# Create a `logout_request` view to handle sign out request
@csrf_exempt
def logout_request(request):
    """Handle logout request"""
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    """Handle registration request"""
    # Get the user information from request.POST
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    if username and password:
        user_does_not_exist = True
        try:
            User.objects.get(username=username)
            user_does_not_exist = False
        except Exception:
            logger.debug(f"%{username}% is new user")
        if user_does_not_exist:
            user = User.objects.create_user(username=username,
                                            first_name=first_name,
                                            last_name=last_name,
                                            email=email,
                                            password=password)
            login(request, user)
            data = {"userName": username, "status": "Authenticated"}
        else:
            data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)
    return JsonResponse({"error": "Invalid request"})


# `get_dealerships` view
@csrf_exempt
def get_dealerships(request, state="all"):
    """Handle get dealerships request"""
    if (state == "all"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


# `get_cars` view
@csrf_exempt
def get_cars(request):
    """Handle get cars request"""
    if request.method == "GET":
        count = CarMake.objects.filter().count()
        if count == 0:
            initiate()
        car_models = CarModel.objects.select_related('car_make')
        cars = []
        for car_model in car_models:
            cars.append({"CarModel": car_model.name,
                         "CarMake": car_model.car_make.name})
        return JsonResponse({"CarModels": cars})
    return JsonResponse({"error": "Invalid request"}, status=400)


# `get_dealer_reviews` view
@csrf_exempt
def get_dealer_reviews(request, dealer_id):
    """Handle get dealer reviews request"""
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            if 'review' in review_detail:
                response = analyze_review_sentiments(review_detail['review'])
                try:
                    review_detail["message"] = response["message"]
                except KeyError:
                    review_detail["sentiment"] = response["sentiment"]
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"message": "bad request"}, status=400)


# `get_dealer_details` view
@csrf_exempt
def get_dealer_details(request, dealer_id):
    """Handle get dealer details request"""
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"message": "bad request"}, status=400)


# `add_review` view
@csrf_exempt
def add_review(request):
    """Handle add review request"""
    data = json.loads(request.body)
    if (data["user"]["is_anonymous"] is False):
        post_data = {}

        for key in data:
            if key == "user":
                value = data[key]["name"]
                Key = "name"
            else:
                value = data[key]
                Key = key
            post_data[Key] = value

        try:
            print("Posting review: ", post_data)
            response = post_review(post_data)
            return JsonResponse(response, status=200)
        except Exception as error:
            return JsonResponse({"message": "Error in posting review /n "
                                 + str(error)},
                                status=401)
    return JsonResponse({"message": "Unauthorized"}, status=403)
