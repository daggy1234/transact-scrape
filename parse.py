import pandas as pd
import json
import uuid
from io import StringIO

with open("transact_data.json","r") as file:
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
	global_df["Date/Time"] = pd.to_datetime(global_df["Date/Time"], format="%m/%d/%Y %I:%M %p", errors="raise")
	global_df["Amount"] = pd.to_numeric(global_df["Amount"].str.replace(" USD", "").str.replace(",", "").str.replace("(", "-").str.replace(")", ""))
	print(global_df.describe())
	global_df.to_parquet(f"{user_uuid}.parquet")


