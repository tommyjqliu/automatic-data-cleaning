from django.http import JsonResponse
from django.core.exceptions import ValidationError

def exception_handler(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as exc:
            return JsonResponse({
                'error': 'Validation Error',
                'message': exc.message,
                'status_code': 400
            }, status=400)
        except Exception as exc:
            raise exc
    return wrapper
