import ReactGA from "react-ga4";

const EventType = {
	CLICK: "click",
};

const EventAction = {
	SINFO: "Clicked on button from SINFO",
	MERCEDES_BENZ_IO: "Clicked on partnerships image from Mercedes-Benz.io",
	AUREN: "Clicked on partnerships image from Auren",
};

const initializeGa = () => {
	ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
};

const registerEvent = (category, action) => {
	ReactGA.event({
		category: category,
		action: action,
	});
};

const registerPageView = (location) => {
	ReactGA.send({
		hitType: "pageview",
		page: location.pathname,
		title: location.pathname,
	});
};

export {
	EventType,
	EventAction,
	initializeGa,
	registerEvent,
	registerPageView,
};
