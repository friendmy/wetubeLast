import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import {
	githubLoginCallback,
	facebookLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GH_ID,
			clientSecret: process.env.GH_SECRET,
			callbackURL: `https://wetubenew.herokuapp.com${routes.githubCallback}`
		},
		githubLoginCallback
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FB_ID,
			clientSecret: process.env.FB_SECRET,
			callbackURL: `https://afraid-baboon-46.localtunnel.me${routes.facebookCallback}`,
			profileFields: ["id", "displayName", "photos", "email"],
			scope: ["public_profile", "email"]
		},
		facebookLoginCallback
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	// console.log(`id: ${id}`);
	User.findById(id)
		.then(user => {
			done(null, user);
		})
		.catch(error => {
			console.log(`Error: ${error}`);
		});
});
