# Prerequisites

To begin, you will need:

* A Microsoft 365 subscription

* A team with the users who will be sending Tetris Tournament using this app.
    (You can add and remove team members later!)

* A copy of the Tetris Tournament app GitHub repo
    (<https://github.com/OfficeDev/Microsoft-Teams-Tetris-Tournament-app>)

* Install Node.js (using <https://nodejs.org/en/download/>) locally on your
    machine.

# Step 1: Create your Tetris Tournament app

To create the Teams Tetris Tournament app package:

1.  Make sure you have cloned the app repository locally.

2.  Open the actionManifest.json file in a text editor.

3.  Change the placeholder fields in the manifest to values appropriate for your
    organization.

    * packageID - A unique identifier for this app in reverse domain notation.
        E.g: com.contoso.Tetris Tournamentapp. (Max length: 64)

    * developer.[]()name ([What's
        this?](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema#developer))

    * developer.websiteUrl

    * developer.privacyUrl

    * developer.termsOfUseUrl

Note: Make sure you do not change file structure of the app package, with no new
nested folders.

# Step 2: Deploy app to your organisation

1.  Install Node.js (using <https://nodejs.org/en/download/>) locally on your
    machine.

2.  Open Command Line on your machine.

3.  Navigate to the app package folder with the name
    `microsoft-teams-Tetris-Tournament-app`.

4.  Run the following command to download all the dependent files mentioned in
    package.json file of the app package.

    **```npm install```**

5.  Once the dependent files are downloaded, run the below command to deploy the
    app package to your Microsoft 365 subscription. When prompted, log in to
    your AAD account.

    **```npm run deploy```**

6.  An AAD custom app, Bot are programmatically created in your tenant to power
    the Tetris Tournament message extension app in Teams.

7.  Once run, a Tetris Tournament Teams app zip file is generated under output
    folder in the same directory as your cloned app repository locally with the
    name microsoft-teams-tetris-tournament-upload.zip.

# Step 3: Run the app in Microsoft Teams

If your tenant has sideloading apps enabled, you can install your app by
following the instructions
[here](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/apps/apps-upload#load-your-package-into-teams).

You can also upload it to your tenant's app catalog, so that it can be available
for everyone in your tenant to install. See
[here](https://docs.microsoft.com/en-us/microsoftteams/tenant-apps-catalog-teams).

Upload the generated Tetris Tournament Teams app zip file (the
`microsoft-teams-Tetris-Tournament-upload.zip`) under output folder in the same
directory as your cloned app repository locally to your channel, chat, or
tenant’s app catalog.

# Step 4: Update your Tetris Tournament Teams app

If you want to update the existing Tetris Tournament Teams app with latest
functionality -

1.  Make sure you have cloned the latest app repository locally.

2.  Open the `actionManifest.json` file in a text editor.

    * Change the placeholder fields (`packageID`, `developer.name`, `developer.websiteUrl`, `developer.privacyUrl`, `developer.termsOfUseUrl`) in
        the manifest with existing values in your Tetris Tournament Teams app.

    * Update the `version` field in the manifest. Make sure latest version
        number is higher than previous version number.

3.  Run the below command to update your Tetris Tournament Teams app with the
    latest bits of code. When prompted, log in using your AAD account.

        npm run update-teams-app

4.  Your Tetris Tournament app on Teams automatically gets updated to the latest
    version.

### Troubleshooting

Please see our [Troubleshooting](Troubleshooting.md) page