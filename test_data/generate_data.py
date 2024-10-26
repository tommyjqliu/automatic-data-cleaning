from api.lib import generate_data


if __name__ == "__main__":
    df = generate_data()
    df.to_csv("large_test_data.csv", index=False)
