import functools
import pandas as pd
import numpy as np

from .parse_data import to_bool, to_complex, to_datetime, to_number, to_number_type, to_timedelta


def type_statistic(values: pd.Series):
    """
    Given a pandas Series, return a list of type statistics.
    The column is attempted to be converted to each type and the count of successful conversions is recorded.
    """
    length = len(values)
    counts = {}

    numeric_type = values.apply(to_number_type)
    counts["int8"] = sum(numeric_type == "int8")
    counts["int16"] = sum(numeric_type == "int16") + counts["int8"]
    counts["int32"] = sum(numeric_type == "int32") + counts["int16"]
    counts["int64"] = sum(numeric_type == "int64") + counts["int32"]
    counts["float32"] = sum(numeric_type == "float32")
    counts["float64"] = sum(numeric_type == "float64") + counts["float32"]


    counts["complex"] = sum(values.apply(to_complex).notna())
    counts["bool"] = sum(values.apply(to_bool).notna())
    counts["datetime"] = sum(pd.to_datetime(values, errors="coerce", format="mixed").notna())
    counts["timedelta"] = sum(pd.to_timedelta(values, errors="coerce").notna())
    counts["string"] = max(length - sum(counts.values()), 0)

    statistic = [{"type": "category", "ratio": 1 - values.unique().size / length, "count": values.unique().size}]

    for key, value in counts.items():
        statistic.append({"type": key, "ratio": value / length, "count": value})

    return sorted(statistic, key=functools.cmp_to_key(type_compare))

def type_compare(a, b):
    """
    Compare two type statistics
    """
    def is_category(type):
        return type["type"] == "category" and type["ratio"] > 0.5 and type["count"] < 1000 and type["count"] > 2

    # Prioritize category type
    if is_category(a):
        return -1
    if is_category(b):
        return 1

    if a["ratio"] != b["ratio"]:
        return b["ratio"] - a["ratio"]

    # Handle special position for types with limited range
    special_order = {
        "int8": 7,
        "int16": 6,
        "int32": 5,
        "int64": 4,
        "float32": 3,
        "float64": 2,
        "complex": 1,
        "timedelta": 0,
    }

    if a["type"] in special_order and b["type"] in special_order:
        return special_order[b["type"]] - special_order[a["type"]]
    
    # For stable sort
    return 0

def convert_to_type(df: pd.DataFrame, types: list):
    print(types)
    result_df = df.copy()
    for i, col in enumerate(df.columns):
        type = types[i]
        if type == "category":
            result_df[col] = df[col].astype("category")
        elif type == "datetime":
            result_df[col] = pd.to_datetime(df[col], errors="coerce", format="mixed")
        elif type == "timedelta":
            result_df[col] = pd.to_timedelta(df[col], errors="coerce")
        elif type == "complex":
            result_df[col] = df[col].apply(to_complex)
        elif type == "bool":
            result_df[col] = df[col].apply(to_bool)
        elif type == "string":
            pass
        else:
            Type = type.capitalize()
            result_df[col] = df[col].apply(lambda x: to_number(x, type)).astype(Type)
    return result_df


def infer_and_convert_data_types(df, sample_size=10000):
    """
    Infer and convert data types for columns in a pandas DataFrame.
    Supported data types: int64, int32, int16, int8, float64, float32, complex, bool, datetime64, timedelta, category
    """
    statistics = []
    for col in df.columns:
        # If the number of non-null values is greater than sample_size, take a random sample
        if df[col].count() > sample_size:
            sample_index = np.random.choice(
                df.index[df[col].notna()], sample_size, replace=False
            )
            values = df[col][sample_index]
        else:
            values = df[col][df[col].notna()]

        values = values.copy().astype("string")
        statistics.append(type_statistic(values))
    # Pick first type as default type
    types = [statistic[0]["type"] for statistic in statistics]
    result_df = convert_to_type(df, types)
    return result_df, statistics