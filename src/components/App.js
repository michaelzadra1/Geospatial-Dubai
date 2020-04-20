import React, { useEffect, useState } from 'react';
import { Map, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import { DriftMarker } from 'leaflet-drift-marker';
import { polygon, points, pointsWithinPolygon } from '@turf/turf';

import {
	DOWNTOWN_DUBAI_LAT_LNG,
	AREA_OF_CONCERN,
	MOVING_USER
} from '../geo_json/constants';

const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

// Format GeoJSON to polygon object so we can track users within polygon
const areaOfConcernPolygon = polygon(
	AREA_OF_CONCERN.features[0].geometry.coordinates
);

const App = () => {
	const userCoords = MOVING_USER.geometry.coordinates;

	const [userLocation, setUserLocation] = useState([
		userCoords[0][1],
		userCoords[0][0]
	]);

	useEffect(() => {
		simulateMovingUser();
	}, []);

	// Simulates tracking a moving user on the Mapbox imagery
	const simulateMovingUser = async () => {
		for (let i = 0; i < userCoords.length; i++) {
			await sleep(500);
			// GEOjson format is [long, lat] - Leaflet expects [lat, long] - must swap
			setUserLocation([userCoords[i][1], userCoords[i][0]]);
			if (i === userCoords.length - 1) {
				i = 0;
			}
		}
	};

	const isUserInArea = () => {
		const geoUserPoint = points([[userLocation[1], userLocation[0]]]);
		const pointsInAreaOfConcern = pointsWithinPolygon(
			geoUserPoint,
			areaOfConcernPolygon
		);
		if (pointsInAreaOfConcern.features.length > 0) {
			return true;
		}
		return false;
	};

	const renderAreaOfConcern = () => {
		const style = isUserInArea()
			? () => ({
					color: 'red'
			  })
			: () => ({
					color: 'blue'
			  });
		return (
			<GeoJSON key="area-of-concern" data={AREA_OF_CONCERN} style={style} />
		);
	};

	return (
		<Map
			center={DOWNTOWN_DUBAI_LAT_LNG}
			zoom={19}
			style={{ height: '100vh', width: '100%' }}
		>
			<TileLayer
				url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibWljaGFlbHphZHJhMSIsImEiOiJjazk3ZzByb3AwZXdrM2Z0YTd5Z3pyb3MxIn0.ZHFWNNq1INFozmIDmHlSbw"
				attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
			/>
			{renderAreaOfConcern()}
			<DriftMarker position={userLocation} duration={500}>
				<Tooltip permanent>Moving User</Tooltip>
			</DriftMarker>
		</Map>
	);
};

export default App;
