import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


def test_health_endpoint(api_client):
    response = api_client.get(reverse("api-health"))

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "status": "ok",
        "service": "university-student-management-api",
    }


def test_swagger_docs_endpoint(api_client):
    response = api_client.get(reverse("swagger-ui"))

    assert response.status_code == status.HTTP_200_OK


def test_schema_endpoint(api_client):
    response = api_client.get(reverse("schema"))

    assert response.status_code == status.HTTP_200_OK
    assert "University Student Management API" in response.content.decode()


@pytest.mark.django_db
def test_student_can_register_and_login(api_client):
    credentials = {
        "username": "student_one",
        "email": "student@example.com",
        "password": "StrongPass123!",
    }

    register_response = api_client.post(
        reverse("student-register"),
        data=credentials,
        format="multipart",
    )

    assert register_response.status_code == status.HTTP_201_CREATED
    assert register_response.data["username"] == credentials["username"]
    assert "access" in register_response.data
    assert "refresh" in register_response.data

    login_response = api_client.post(
        reverse("student-login"),
        data={
            "username": credentials["username"],
            "password": credentials["password"],
        },
        format="json",
    )

    assert login_response.status_code == status.HTTP_200_OK
    assert login_response.data["username"] == credentials["username"]
    assert "access" in login_response.data
