from django.test import TestCase

class TestViews(TestCase):
    def test_upload_file(self):
        with open('test_data/sample_data.csv', 'rb') as f:
            file_content = f.read()
        response = self.client.post('/api/upload/', {'file': file_content})
        self.assertEqual(response.status_code, 200)