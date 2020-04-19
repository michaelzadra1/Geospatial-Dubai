import React from 'react';
import { Map, TileLayer } from 'react-leaflet';

const DOWNTOWN_DUBAI_LATLNG = [25.19138894280226, 55.28071403503418];

const App = () => {
	return (
		<Map
			center={DOWNTOWN_DUBAI_LATLNG}
			zoom={17}
			style={{ height: '100vh', width: '100%' }}
		>
			<TileLayer
				url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibWljaGFlbHphZHJhMSIsImEiOiJjazk3ZzByb3AwZXdrM2Z0YTd5Z3pyb3MxIn0.ZHFWNNq1INFozmIDmHlSbw"
				attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
			/>
		</Map>
	);
};

export default App;
