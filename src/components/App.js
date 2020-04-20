import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MapBoxWrapper from './MapBoxWrapper';

const TOAST_CONFIG = {
	position: toast.POSITION.TOP_CENTER,
	autoClose: 2000,
	pauseOnHover: false,
	draggable: false
};

const App = () => {
	const [status, setStatus] = useState('Neutral');

	// Displays toast notification when user enters or exits area of concern
	const notify = (type) => {
		if (type === 'Entered' && status === 'Neutral') {
			setStatus('Warning');
			return toast.warning('User has entered the area!', TOAST_CONFIG);
		} else if (type === 'Departed' && status === 'Warning') {
			setStatus('Neutral');
			return toast.info('User has departed the area.', TOAST_CONFIG);
		}
	};

	return (
		<React.Fragment>
			<ToastContainer />
			<MapBoxWrapper notify={notify} />
		</React.Fragment>
	);
};

export default App;
