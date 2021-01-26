import os
import numpy as np
import pandas as pd
import random
import keras.models

from flask import Flask, flash, request, jsonify, render_template


# try:
#     db_uri = os.environ['DATABASE_URL']
# except KeyError:
#     db_uri = f"postgres://postgres:{Posgres_Pswrd}@localhost:5432/wildfires_db"



app = Flask(__name__)

data_path = './static/data/'

def load_model():
    global new_model
    new_model = keras.models.load_model('./static/model/fires_class_model_v1.h5')
    print("Model Loaded")
     


def process_input(data):
    infile=""
    # convert to dataframe for easy processing
    df = pd.DataFrame([data])
    
    counties = pd.read_csv(data_path + 'idaho_counties.csv')
    counties_dummy = pd.get_dummies(counties["NAME"],prefix="NAME")
    counties_dummy = counties_dummy.iloc[:1]
    counties_dummy.fillna(0)

    county= 'NAME_' + df['County']
    counties_dummy.at[0, county]=1
    
    df['DISCOVERY_MONTH_CONVERTED'] = df['DISCOVERY_MONTH_CONVERTED'].astype(np.int64)
    
    df['D0'] = df['D0'].astype(float)
    df['D1'] = df['D1'].astype(float)
    df['D2'] = df['D2'].astype(float)
    df['D3'] = df['D3'].astype(float)
    df['D4'] = df['D4'].astype(float)

    df['DAY_AVG_TEMP_1'] =  df['DAY_AVG_TEMP_1'].astype(float)
    df['DAY_AVG_TEMP_2'] =  df['DAY_AVG_TEMP_2'].astype(float)
    df['DAY_AVG_TEMP_3'] =  df['DAY_AVG_TEMP_3'].astype(float)
    df['DAY_AVG_TEMP_4'] =  df['DAY_AVG_TEMP_4'].astype(float)

    df['DAY_PRCP_1'] = df['DAY_PRCP_1'].astype(float)
    df['DAY_PRCP_2'] = df['DAY_PRCP_2'].astype(float)
    df['DAY_PRCP_3'] = df['DAY_PRCP_3'].astype(float)
    df['DAY_PRCP_4'] = df['DAY_PRCP_4'].astype(float)

    df = df.drop(['County'], axis = 1)

    new_df = pd.concat([df, counties_dummy], axis=1)

    print("Print Number of cols",len(new_df.columns))
    
    print(new_df.dtypes)

    new_df = new_df.values.reshape(-1, 58)

    print("New shape", new_df.shape)

    print("type of new_df", type(new_df))
    

    return new_df




@app.route("/")
def home():
    
    return render_template('index.html')

    

@app.route('/calc_fires', methods=['GET', 'POST'])
def calc_fires():
    message=''
    if request.method == 'POST':
        message = "data posted"
        input_data = request.form.to_dict()
        data = process_input(input_data) 
        value = np.argmax(new_model.predict(data))

        print(f"value {value}")

        if value == 0:      
            fire_class = "Small"
        else :
            fire_class = "Large"
        
        return render_template('calc_fires.html', result=fire_class)  
            
    return render_template('calc_fires.html')  


    

@app.route('/calc_fires2', methods=['GET', 'POST'])
def calc_fires2():
    message=''
    if request.method == 'POST':
        message = "data posted"
        input_data = request.form.to_dict()
        data = process_input(input_data)
 
    return render_template('calc_fires2.html')



if __name__ == '__main__':
    load_model()
    app.run(debug=True)