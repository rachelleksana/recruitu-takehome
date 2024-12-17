# RecruitU Takehome: Company Movement Graph V0

## Overview

This project is a limited example of visualizing a graph based on people's
movement between companies. I believe this could be interesting for a variety of reasons:

- for companies to see who's sniping their talent
- for developers to gather data on how successful matching is, and/or consider recommendation strategies
- for candidates to see successful movement pathways that they may want to try

The user can choose a "current company" that they want to see data for, and then
view a diagram that shows how many people moved to that company from a different company.

## Tech Stack

This is a Typescript NextJS project generated with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Some additional technical choices:

- [tailwind](https://tailwindcss.com/) for speed of styling
- [react-query](https://tanstack.com/query/latest) for handling data fetching, retries, etc

FYI: all the logic lives in `index.tsx`

## Running Locally

Pre-requisites: you must have Nodejs and npm [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Make sure you are in the `recruitu-takehome` root directory.
2. Run `npm i` to install all dependencies.
3. Run `npm run dev` to start the application.
4. It will now be available at http://localhost:3000.
5. You can choose a current company and then click the draw button to see the graph.

If you get an error about mismatched node versions, please let me know. I
use [nvm](https://blog.logrocket.com/how-switch-node-js-versions-nvm/) to manage node
versions on my machine but I would like to save people from having to do that extra work if I can.

## Considerations/Followups

1. I prioritized keeping the code simple and self-contained for this version, so the graph is pretty sad-looking.
   As a followup I would definitely want to try external libraries such as [cytoscape](https://js.cytoscape.org/).
2. I set the api count to 100 for my convenience, but the application should be able to pull all the data.
3. I also limited the company choices for my convenience, but there's a lot of cool followup that could be done
   to give the user more control such as allowing them to set the list, or choose how many phases of movement they want displayed.
   There's also much better filtering that should be available other than just the person's current company.
