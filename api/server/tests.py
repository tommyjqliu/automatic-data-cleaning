import json
from django.test import TestCase
from lib.generate_data import generate_data
import os


class TestViews(TestCase):
    def setUp(self):
        """
        Generate test data files if they don't exist
        """
        test_sizes = {"small": 100, "medium": 10000, "large": 100000}
        
        if not os.path.exists("test_data"):
            os.makedirs("test_data")
        
        for size, num_rows in test_sizes.items():
            file_path = f"test_data/{size}_test.csv"
            if not os.path.exists(file_path):
                df = generate_data(num_rows)
                df.to_csv(file_path, index=False)

    def test_small_data(self):
        response = self.client.post(
            "/api/auto_parse", {"file": open("test_data/small_test.csv", "rb")}
        )
        self.assertEqual(200, response.status_code)
        response_json = json.loads(response.content)
        infer_types = [s[0]["type"] for s in response_json["statistics"]]
        self.assertEqual(
            infer_types,
            [
                "int8",
                "string",
                "int8",
                "float32",
                "float32",
                "float32",
                "bool",
                "complex",
                "datetime",
                "timedelta",
                "category",
            ],
        )

    def test_medium_data(self):
        response = self.client.post(
            "/api/auto_parse", {"file": open("test_data/medium_test.csv", "rb")}
        )
        self.assertEqual(200, response.status_code)
        response_json = json.loads(response.content)
        infer_types = [s[0]["type"] for s in response_json["statistics"]]
        self.assertEqual(
            infer_types,
            [
                "int16",
                "string",
                "int8",
                "float32",
                "float32",
                "float32",
                "bool",
                "complex",
                "datetime",
                "timedelta",
                "category",
            ],
        )

    def test_large_data(self):
        response = self.client.post(
            "/api/auto_parse", {"file": open("test_data/large_test.csv", "rb")}
        )
        self.assertEqual(200, response.status_code)
        response_json = json.loads(response.content)
        infer_types = [s[0]["type"] for s in response_json["statistics"]]
        self.assertEqual(
            infer_types,
            [
                "int32",
                "string",
                "int8",
                "float32",
                "float32",
                "float32",
                "bool",
                "complex",
                "datetime",
                "timedelta",
                "category",
            ],
        )
