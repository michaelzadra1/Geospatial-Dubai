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
const userTravelPoints = MOVING_USER.geometry.coordinates;

const MapBoxWrapper = (props) => {
	const [userLocation, setUserLocation] = useState([
		userTravelPoints[0][1],
		userTravelPoints[0][0]
	]);

	useEffect(() => {
		simulateMovingUser();
	}, []);

	// Simulates tracking a moving user on the Mapbox imagery
	const simulateMovingUser = async () => {
		for (let i = 0; i < userTravelPoints.length; i++) {
			await sleep(350);
			// GEOjson format is [long, lat] - Leaflet expects [lat, long] - must swap
			setUserLocation([userTravelPoints[i][1], userTravelPoints[i][0]]);
			if (i === userTravelPoints.length - 1) {
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

	// Changes color of concern and notifies user on enter/exit of area
	const renderAreaOfConcern = () => {
		const { notify } = props;
		let style;
		if (isUserInArea()) {
			notify('Entered');
			style = () => ({
				color: 'red'
			});
		} else {
			notify('Departed');
			style = () => ({
				color: 'blue'
			});
		}
		return (
			<GeoJSON key="area-of-concern" data={AREA_OF_CONCERN} style={style} />
		);
	};

	return (
		<Map
			center={DOWNTOWN_DUBAI_LAT_LNG}
			zoom={18}
			style={{ height: '100vh', width: '100%' }}
		>
			<TileLayer
				url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibWljaGFlbHphZHJhMSIsImEiOiJjazk3ZzByb3AwZXdrM2Z0YTd5Z3pyb3MxIn0.ZHFWNNq1INFozmIDmHlSbw"
				attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
			/>
			{renderAreaOfConcern()}
			<DriftMarker position={userLocation} duration={350}>
				<Tooltip>Moving User</Tooltip>
			</DriftMarker>
		</Map>
	);
};

export default MapBoxWrapper;
