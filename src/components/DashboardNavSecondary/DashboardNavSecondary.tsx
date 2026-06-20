import {
	DashboardButton,
	DashboardButtonLink,
	DashboardList,
	DashboardLogo,
	DashboardSection,
} from "..";
import Icon from "../Icons/Icons";

function DashboardNavSecondary({
	handleClearCache,
	handleSignOut,
	showLogo,
}: {
	handleClearCache: () => void;
	handleSignOut: () => void;
	showLogo: boolean;
}) {
	return (
		<nav>
			{showLogo ? (
				<DashboardSection>
					<DashboardLogo />
				</DashboardSection>
			) : null}
			<DashboardSection>
				<DashboardList>
					<DashboardList.Li>
						<DashboardButtonLink
							icon={<Icon.User />}
							to="/profile"
							text="Profile"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.Import />}
							onClick={() => alert("Import & export")}
							text="Import & export"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.Extension />}
							onClick={() => alert("Browsers extensions")}
							text="Browsers extensions"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.Star />}
							onClick={() => alert("Pro features")}
							text="Pro features"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.Reload />}
							onClick={handleClearCache}
							text="Clear cache and sync"
						/>
					</DashboardList.Li>
					<DashboardList.Li>
						<DashboardButton
							icon={<Icon.SignOut />}
							onClick={handleSignOut}
							text="Sign out"
						/>
					</DashboardList.Li>
				</DashboardList>
				{
					// <h1>User</h1>
					// <p>Username: {user.username}</p>
					// <p>Display name: {user.displayName}</p>
					// <p>Email: {user.email}</p>
					// <p>Pro: {user.isPro ? "Yes" : "No"}</p>
					// <p>Admin: {user.isAdmin ? "Yes" : "No"}</p>
					// <p>Member since: {user.createdAt.slice(0, 10)}</p>
				}
			</DashboardSection>
		</nav>
	);
}

export default DashboardNavSecondary;
