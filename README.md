# pushcrew-staging-dashboard
Dashboard for PushCrew's Staging Instances

#### Instructions:
* Swap out the firebase config in ```config/constants``` with your own
* ```npm install```
* ```npm start```
* Visit ```localhost:3000``


AFAIK this won't work locally, you'll have to keep pushing changes to some place with an actual domain name. This is because we're using Google to authenticate.


I deploy to firebase to see the changes: `npm run build && firebase deploy`, but you'll have to [set up Firebase Hosting](https://firebase.google.com/docs/hosting/quickstart), of course.