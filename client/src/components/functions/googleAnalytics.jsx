import ReactGA from "react-ga";

const EventType = {
	CLICK: "click",
};

const EventAction = {
	SINFO: "Clicked on button from SINFO",
	MERCEDES_BENZ_IO: "Clicked on partnerships image from Mercedes-Benz.io",
	AUREN: "Clicked on partnerships image from Auren",
};

const registerEvent = (category, action) => {
	ReactGA.event({
		category: category,
		action: action,
	});
};

const registerPageView = (localtion) => {
	ReactGA.pageview(localtion.pathname + localtion.search);
};

export { EventType, EventAction, registerEvent, registerPageView };
