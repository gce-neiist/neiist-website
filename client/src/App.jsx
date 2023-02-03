import React, { useState, useEffect, useContext, Suspense, lazy } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; // importing required bootstrap styles

import UserDataContext from "./UserDataContext";

import Layout from "./components/Layout";
import LoadSpinner from "./hooks/loadSpinner";

const HomePage = lazy(() => import("./pages/HomePage"));
const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const RulesPage = lazy(() => import("./pages/RulesPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const ThesisMasterPage = lazy(() => import("./pages/ThesisMasterPage"));
const MemberPage = lazy(() => import("./pages/MemberPage"));
const AdminMenuPage = lazy(() => import("./pages/AdminMenuPage"));
const AdminAreasPage = lazy(() => import("./pages/AdminAreasPage"));
const AdminThesesPage = lazy(() => import("./pages/AdminThesesPage"));
const AdminElectionsPage = lazy(() => import("./pages/AdminElectionsPage"));
const GacPage = lazy(() => import("./pages/GacPage"));

const Error = ({ error, errorDescription }) => (
	<>
		<h1>{error}</h1>
		<p>{errorDescription}</p>
	</>
);

const App = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const [userData, setUserData] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const authFromCode = async () => {
		const code = urlParams.get("code");
		const accessTokenResponse = await fetch(`/api/auth/accessToken/${code}`);
		const accessToken = await accessTokenResponse.text();

		window.sessionStorage.setItem("accessToken", accessToken);

		await fetch(`/api/auth/userData/${accessToken}`).then(
			(userDataResponse) => {
				window.location.replace("/").then(() => {
					const userDataJson = userDataResponse.json();
					if (userDataJson) setUserData(userDataJson);
				});
			}
		);
	};

	const tryAuthFromSessionStorage = async () => {
		const accessToken = window.sessionStorage.getItem("accessToken");

		if (accessToken) {
			const userDataResponse = await fetch(`/api/auth/userData/${accessToken}`);
			const userDataJson = await userDataResponse.json();

			if (userDataJson) {
				setUserData(userDataJson);
			}
		}
	};

	useEffect(() => {
		async function auth() {
			if (urlParams.has("code")) await authFromCode();
			else await tryAuthFromSessionStorage();
			setIsLoaded(true);
		}
		auth();
	}, []);

	if (!isLoaded) {
		return <LoadSpinner />;
	}

	if (urlParams.has("error")) {
		return (
			<Error
				error={urlParams.get("error")}
				errorDescription={urlParams.get("error_description")}
			/>
		);
	}

	return (
		<UserDataContext.Provider value={{ userData, setUserData }}>
			<Router Router forceRefresh>
				<Suspense fallback={<LoadSpinner />}>
					<Layout>
						<Switch>
              {/* PUBLIC */}
							<Route exact path="/">
								<HomePage />
							</Route>
							<Route path="/atividades">
								<ActivitiesPage />
							</Route>
							<Route path="/sobre_nos">
								<AboutPage />
							</Route>
							<Route path="/estatutos">
								<RulesPage />
							</Route>
							<Route path="/contactos">
								<ContactsPage />
							</Route>

              {/* AUTHENTICATED */}
							<ActiveTecnicoStudentRoute path="/socio">
								<MemberPage />
							</ActiveTecnicoStudentRoute>
							<ActiveLMeicStudentRoute path="/thesismaster">
								<ThesisMasterPage />
							</ActiveLMeicStudentRoute>

              {/* ADMIN */}
							<AdminRoute exact path="/admin">
								<AdminMenuPage />
							</AdminRoute>
							<AdminRoute path="/admin/areas">
								<AdminAreasPage />
							</AdminRoute>
							<AdminRoute path="/admin/theses">
								<AdminThesesPage />
							</AdminRoute>
							<AdminRoute path="/admin/elections">
								<AdminElectionsPage />
							</AdminRoute>

							<GacRoute path="/mag">
								<GacPage />
							</GacRoute>

              {/* FALLBACK */}
							<Route path="/*">
								<Redirect to="/" />
							</Route>
						</Switch>
					</Layout>
				</Suspense>
			</Router>
		</UserDataContext.Provider>
	);
};

const PrivateRoute = ({ exact, path, children }) => (
	<Route exact={exact} path={path}>
		{children}
	</Route>
);

const ActiveTecnicoStudentRoute = ({ exact, path, children }) => {
	const { userData } = useContext(UserDataContext);

	if (userData && userData.isActiveTecnicoStudent)
		return <PrivateRoute exact={exact} path={path} children={children} />;
	return <Redirect to="/" />;
};

const ActiveLMeicStudentRoute = ({ exact, path, children }) => {
	const { userData } = useContext(UserDataContext);

	if (userData && userData.isActiveLMeicStudent)
		return <PrivateRoute exact={exact} path={path} children={children} />;
	return <Redirect to="/" />;
};

const GacRoute = ({ exact, path, children }) => {
	const { userData } = useContext(UserDataContext);

	if (userData && userData.isGacMember)
		return <PrivateRoute exact={exact} path={path} children={children} />;
	return <Redirect to="/" />;
};

const AdminRoute = ({ exact, path, children }) => {
	const { userData } = useContext(UserDataContext);

	if (userData && userData.isAdmin)
		return <PrivateRoute exact={exact} path={path} children={children} />;
	return <Redirect to="/" />;
};

export default App;
