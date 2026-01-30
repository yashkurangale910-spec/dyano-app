import os
path = r"C:\Users\yashk\.cache\huggingface\hub\models--microsoft--Phi-3-mini-4k-instruct\snapshots\0a67737cc96d2554230f90338b1f39ac1d28e925b323eae81227eaba4464caced4e"
try:
    print(os.listdir(path))
except Exception as e:
    print(f"ERROR: {e}")
