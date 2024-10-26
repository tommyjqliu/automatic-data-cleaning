import pandas as pd
import numpy as np
from datetime import datetime, timedelta


def generate_data(n_rows=100000, seed=42):
    np.random.seed(seed)

    data = {
        "ID": range(1, n_rows + 1),
        "Name": [f"Person_{i}" for i in range(1, n_rows + 1)],
        "Age": np.random.randint(18, 80, n_rows),
        "Height": np.random.uniform(150, 200, n_rows),
        "Weight": np.random.uniform(45, 120, n_rows),
        "Score": np.random.uniform(0, 100, n_rows),
        "IsStudent": np.random.choice([True, False], n_rows),
        "ComplexNumber": np.random.uniform(-10, 10, n_rows)
        + 1j * np.random.uniform(-10, 10, n_rows),
        "Date": [
            datetime.now().date() - timedelta(days=np.random.randint(0, 36500))
            for _ in range(n_rows)
        ],
        "Time": [timedelta(seconds=np.random.randint(0, 86400)) for _ in range(n_rows)],
        "Category": np.random.choice(["A", "B", "C", "D", "E"], n_rows),
    }

    df = pd.DataFrame(data)
    return df
