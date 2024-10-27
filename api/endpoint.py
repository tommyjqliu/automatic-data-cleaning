"""wsgi endpoint for vercel deployment"""
import os
import sys

base_path = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, base_path)

from server.wsgi import app