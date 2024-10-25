from django.http import HttpResponse
import pandas as pd
from io import BytesIO

def hello_world(request):
    return HttpResponse("Hello, World!")

def parse_dataset(request):
    print("Parsing dataset")
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')
        if uploaded_file:
            # Check file extension
            file_extension = uploaded_file.name.split('.')[-1].lower()
            
            # Read the file into a BytesIO object
            file_content = BytesIO(uploaded_file.read())
            
            if file_extension == 'csv':
                df = pd.read_csv(file_content)
            elif file_extension in ['xls', 'xlsx']:
                df = pd.read_excel(file_content)
            else:
                return HttpResponse("Unsupported file format. Please upload a CSV or Excel file.", status=400)
            
            # You can now work with the DataFrame 'df'
            # For example, you could return the number of rows:
            return HttpResponse(f"File processed successfully. Number of rows: {len(df)}")
        else:
            return HttpResponse("No file uploaded.", status=400)
    else:
        return HttpResponse("This endpoint only accepts POST requests.", status=405)
