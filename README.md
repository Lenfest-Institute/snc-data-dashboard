# SNC Data Dashboard

Interactive data visualization dashboard for Lenfest/INN's Statewide News Collective survey project, built with SvelteKit and Layer Cake.

## Getting Started

### Prerequisites
- Node.js 16+
- npm or pnpm

### Installation

### Commands
`npm run dev`: Start the development server
`npm run build`: Build the project for production
`npm run preview`: Preview the production build locally
`npm run lint`: Check code formatting, accessbility compliance and linting
`npm run format`: Automatically format the code
`npm run data [path/datafile.csv]`: Process data files

#### Processing Data

This repo does not include the original data file. In order to process data for the app, run the command `npm run data [path/datafile.csv]` replacing the bracketed file path with the relative path to your data file, in CSV format.

After running that command, the processed JSON file of the data will be available at static/data/filteredData.json.

Columns can be omitted from the data processing by putting the column key name in the `ignoreColumns` array in the process-data.js file.

## Project Structure
src/
  ├── lib/           # Shared utilities and components
  ├── routes/        # Page components and routing
  ├── components/    # Reusable chart components
  └── static/        # Static assets and data files

## Charts and Components
- Beeswarm Chart: Visualizes data points as a swarm of circles.
- Column Chart: Displays data as vertical bars.
- Cleveland Dot Plot: Also known as a lollipop chart.
- Proportion Bar: Shows proportions of different categories.
- Stacked Bar Chart: Displays data as stacked bars.
