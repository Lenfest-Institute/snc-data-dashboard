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
`npm run data`: Process data files

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
