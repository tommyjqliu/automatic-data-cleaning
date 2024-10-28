import json
from django.forms import ValidationError
import pandas as pd
import logging
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from lib.generate_data import generate_data
from lib.exception_handler import exception_handler
from lib.infer_data_types import convert_to_type, infer_and_convert_data_types


logger = logging.getLogger(__name__)


def get_dataframe(request):
    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        raise ValidationError("No file uploaded.")

    file_extension = uploaded_file.name.split(".")[-1].lower()
    if file_extension == "csv":
        df = pd.read_csv(uploaded_file)
    elif file_extension in ["xls", "xlsx"]:
        df = pd.read_excel(uploaded_file)
    else:
        raise ValidationError(
            "Unsupported file format. Please upload a CSV or Excel file."
        )

    if df.empty:
        raise ValidationError("The uploaded file is empty.")

    return df


@require_http_methods(["POST"])
@exception_handler
def auto_parse_dataset(request):
    df = get_dataframe(request)
    df, statistics = infer_and_convert_data_types(df)

    response = {
        "statistics": statistics,
        "data": df.to_csv(index=False),
    }

    return HttpResponse(json.dumps(response))


@require_http_methods(["POST"])
@exception_handler
def manual_parse_dataset(request):
    df = get_dataframe(request)
    types = request.POST.get("types").split(",")

    if not types:
        raise ValidationError("No types provided.")

    df = convert_to_type(df, types)
    response = {
        "data": df.to_csv(index=False),
    }

    return HttpResponse(json.dumps(response))


@exception_handler
def example_dataset(request):
    df = generate_data(1000)
    df, statistics = infer_and_convert_data_types(df)

    response = {
        "statistics": statistics,
        "data": df.to_csv(index=False),
    }

    return HttpResponse(json.dumps(response))
