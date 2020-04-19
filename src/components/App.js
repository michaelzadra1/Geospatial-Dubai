import React, { useEffect, useState } from 'react';
import { Map, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import { DriftMarker } from 'leaflet-drift-marker';

import {
	DOWNTOWN_DUBAI_LAT_LNG,
	AREA_OF_CONCERN,
	MOVING_USER
} from '../geo_json/constants';

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const App = () => {
	const [userLocation, setUserLocation] = useState(MOVING_USER[0]);

	useEffect(() => {
		simulateMovingUser();
	}, []);

	const simulateMovingUser = async () => {
		for (let i = 0; i < MOVING_USER.length; i++) {
			await sleep(750);
			setUserLocation(MOVING_USER[i]);
			if (i === MOVING_USER.length - 1) {
				i = 0;
			}
		}
	};

	return (
		<Map
			center={DOWNTOWN_DUBAI_LAT_LNG}
			zoom={17}
			style={{ height: '100vh', width: '100%' }}
		>
			<TileLayer
				url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibWljaGFlbHphZHJhMSIsImEiOiJjazk3ZzByb3AwZXdrM2Z0YTd5Z3pyb3MxIn0.ZHFWNNq1INFozmIDmHlSbw"
				attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
			/>
			<GeoJSON key="area-of-concern" data={AREA_OF_CONCERN} />
			<DriftMarker position={userLocation} duration={600}>
				<Tooltip>Moving User</Tooltip>
			</DriftMarker>
		</Map>
	);
};

export default App;
