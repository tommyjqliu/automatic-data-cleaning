import numpy as np
import pandas as pd


def return_nan_on_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except:
            return np.nan

    return wrapper


@return_nan_on_error
def to_complex(value):
    return complex(value)


@return_nan_on_error
def to_bool(value):
    if isinstance(value, bool):
        return value
    if value in ["True", "true", "TRUE", "1"]:
        return True
    elif value in ["False", "false", "FALSE", "0"]:
        return False
    else:
        return np.nan

@return_nan_on_error
def to_datetime(value):
    return pd.to_datetime(value)


@return_nan_on_error
def to_timedelta(value):
    return pd.to_timedelta(value)


@return_nan_on_error
def to_number(value, type):
    return getattr(np, type)(value)


@return_nan_on_error
def to_number_type(value):
    # Convert string to float
    num = float(value)

    # Check if it's an integer
    if num.is_integer():
        if np.iinfo(np.int8).min <= num <= np.iinfo(np.int8).max:
            return "int8"
        elif np.iinfo(np.int16).min <= num <= np.iinfo(np.int16).max:
            return "int16"
        elif np.iinfo(np.int32).min <= num <= np.iinfo(np.int32).max:
            return "int32"
        elif np.iinfo(np.int64).min <= num <= np.iinfo(np.int64).max:
            return "int64"

    # Check if it's a float
    if np.finfo(np.float32).min <= num <= np.finfo(np.float32).max:
        if np.float32(num) == num:  # Check precision
            return "float32"
    if np.finfo(np.float64).min <= num <= np.finfo(np.float64).max:
        return "float64"
    
    return np.nan
