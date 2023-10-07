# GitHub User Follower Count

This project allows you to search for GitHub users and retrieve the number of followers for each user. The project is implemented using React and Axios. It also includes features like sorting users by the number of followers and a progress user count to track counting completion.

**NOTE**: as deployment link is not working to play with code live please refer below codesandbox link. 

[CODESANDBOX-GITHUB-USER-DISPLAY](https://codesandbox.io/p/github/new-one-one-one/github-user-display/main?workspaceId=cc653f59-f85c-4344-8ead-839c5dc55696)

## Table of Contents

- [Features](#features)
- [How to Use](#how-to-use)
- [Code Explanation](#code-explanation)
  - [Search and Count Followers](#search-and-count-followers)
  - [Cancel Ongoing Requests](#cancel-ongoing-requests)
  - [Sorting Users](#sorting-users)
  - [Progress User Count](#progress-user-count)

## Features

- Search for GitHub users by username.
- Retrieve and display the number of followers for each user.
- Sort users based on the number of followers in descending order.
- Cancel ongoing requests when the search query changes.
- Track the completion of counting followers.

## How to Use

1. Clone this repository.
2. Install the required dependencies using `npm install`.
3. Start the development server with `npm start`.
4. Open the application in your web browser and search for GitHub users.

## Code Explanation

### Search and Count Followers

When you enter a username and click "Search," the application makes an API request to retrieve GitHub users matching the query. For each user found, it initiates the process to count their followers. This process includes making additional API requests to fetch all the followers for a user, as the GitHub API paginates the results.

### Cancel Ongoing Requests

If you change the search query while counting is in progress, the application cancels ongoing requests using the `axios.CancelToken`. This ensures that the application doesn't count followers for the previous query and starts counting for the new one.

### Sorting Users

Once the counting for all users is completed, the application sorts the users in descending order based on the number of followers. This allows you to see the users with the most followers at the top of the list.

### Progress Counting User

A progress count is included to display the completion of follower counting. The progress count is  displayed for out of 30 users only.

This project aims to provide a convenient way to search for GitHub users, retrieve their follower counts, and present the data in an organized and visually appealing manner.
