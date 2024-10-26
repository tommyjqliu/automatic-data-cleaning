import os
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

import pandas as pd
from io import BytesIO

from lib.infer_data_types import infer_and_convert_data_types
import logging

logger = logging.getLogger(__name__)

def hello_world(request):
    return HttpResponse(os.getenv('NODE_ENV'))

@require_http_methods(['POST'])
def parse_dataset(request):
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return HttpResponse("No file uploaded.", status=400)
    
    file_extension = uploaded_file.name.split('.')[-1].lower()
    if file_extension == 'csv':
        df = pd.read_csv(uploaded_file)
    elif file_extension in ['xls', 'xlsx']:
        df = pd.read_excel(uploaded_file)
    else:
        return HttpResponse("Unsupported file format. Please upload a CSV or Excel file.", status=400)
    
    df = infer_and_convert_data_types(df)
    logger.critical("df.dtypes:\n" + str(df.dtypes))
    return HttpResponse(f"File processed successfully. Number of rows: {len(df)}")
    

