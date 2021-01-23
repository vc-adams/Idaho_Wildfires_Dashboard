
# Group 7, Project 3 – US Wildfires Database; Machine Learning Expansion Project <br/>
Members: Kaylon Young, Vincent Adams, Emeka Obianyor, Rob Pascarella

# Abstract:<br/>
--Excerpt from Project 2-- <br/>
Wildfires don’t stop where the wilderness ends. They burn through communities and neighborhoods, destroying property and taking lives. With climate-driven increases in wildfires in the U.S., it is imperative to understand how the risk to homes is also changing nationwide. The convergence of warmer, drier conditions and greater development into flammable landscapes is leaving many communities vulnerable to human-caused wildfires. <br/>

The objective of this project was to extract and explore a publicly available spatial database of wildfires that occurred in the United States from 1992 to 2015 and includes 1.88 million geo-referenced wildfire records, representing a total of 140 million acres burned during the 24-year period. <br/>
-- <br/>

As explained above, from Project 2, large class wildfire data (Class G only - the largest fires which engulf 5000+ acres) was explored and visualized using a plethora of tools learned in the classroom.  Project 3 aims to expand on that idea: We can combine it with hisotical weather data and draught data backed by the power of a machine learning model in an attempt to categorize a risk score for the upcoming wildfire season, and/or instance, for the user! <br/>

We are testing both Support Vecotor Machine and Neural Network methods to answuch questions with a machine learning project as: <br/>
•	Can we predict the size, or in essence give a risk score - for a certain area and data given user-specified inputs?<br/>
•	What areas of the state [note: to limit the dataset we are utlizing on Idaho data] are the most and least fire-prone?<br/>
•	Seasonal impact on size and frequency? <br/>

# Resources:<br/>
The Resourced that are used in this project include: <br/>
1.	1.88 Million US Wildfires available from Kaggle <br/>
•	Data for the project will be refined given the number and volume of data exceeding 1,213,546 fires and burning 140,132,509 acres over a 24 year period. <br/>
•	This data set is massive.  We've paired the project down to simply assess the state of Idaho. <br/>
2.  Weather data API: https://weatherstack.com/ <br/>
3.  Drought data shapefile: https://droughtmonitor.unl.edu/data/GISData.aspx <br/>

# Example of Figures<br/>
1. Tableau was utilized for aesthetic appeal and interactivity. <br/>
2. Leaflet map provides geograpical interactive component. <br/>
3.
4. Slider of events using Javascript https://plotly.com/javascript/sliders/ <br/>
5. Proposed library to be used www.chartjs.org <br/>

# Recreating Application
1. This project has been deployed on Heroku:  https://wildfires-part2-app.herokuapp.com/ <br/>
2. Subcomponents of assembling the project include: <br/>
•	API call from weatherstack.com and matching that data via dates and lat/long with the wildfire locations. 




![200911-wildfire-california-worst-widlfire-year-se-236p_f66f4d02e7ec04cbe3ed0c47dfc8037e](https://user-images.githubusercontent.com/58762374/105122573-134acf80-5a9c-11eb-8257-96803a88f7e2.jpg)


