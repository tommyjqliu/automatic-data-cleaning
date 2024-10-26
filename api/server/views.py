import json
import os
import pandas as pd
import logging
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from lib.infer_data_types import convert_to_type, infer_and_convert_data_types


logger = logging.getLogger(__name__)


def hello_world(request):
    return HttpResponse(os.getenv("NODE_ENV"))


def get_dataframe(request):
    uploaded_file = request.FILES.get("file")
    if not uploaded_file:
        return HttpResponse("No file uploaded.", status=400)

    file_extension = uploaded_file.name.split(".")[-1].lower()
    if file_extension == "csv":
        df = pd.read_csv(uploaded_file)
    elif file_extension in ["xls", "xlsx"]:
        df = pd.read_excel(uploaded_file)
    else:
        return HttpResponse(
            "Unsupported file format. Please upload a CSV or Excel file.", status=400
        )

    return df


@require_http_methods(["POST"])
def auto_parse_dataset(request):
    df = get_dataframe(request)
    df, statistics = infer_and_convert_data_types(df)
    response = {
        "statistics": statistics,
        "data": df.to_csv(index=False),
    }

    return HttpResponse(json.dumps(response))


def manual_parse_dataset(request):
    df = get_dataframe(request)
    types = request.POST.get("types").split(",")
    logger.critical(types)
    if not types:
        return HttpResponse("No types provided.", status=400)
    
    df = convert_to_type(df, types)
    response = {
        "data": df.to_csv(index=False),

    }

    return HttpResponse(json.dumps(response))
