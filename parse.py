import pandas as pd
import json
import uuid
from io import StringIO
from bs4 import BeautifulSoup

with open("combinedTextItems.json","r") as file:
	f = json.load(file)

global_df = None
user_uuid = str(uuid.uuid4())

for item in f["data"]:
	r_item = StringIO(item)
	df = pd.read_html(r_item)[0]
	df.columns = [col[0] for col in df.columns]
	df = df.dropna(subset=['Card Number'])
	df = df.drop(df.index[-1])
	df['Card Number'] = user_uuid
	if global_df is None:
		global_df = df
	else:
		global_df  = pd.concat([global_df, df], ignore_index=True)

global_df.to_csv("parsed.csv")


