# Blood Donation & Emergency Response System

A comprehensive React-based frontend application for managing blood donations and emergency medical responses.

## Features

- User Authentication
- Role-based Access (Donor/Recipient)
- Live Location Tracking
- Real-time Donor Map
- Emergency Medical Services Integration
- AI-based Request Prioritization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API Key

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key for map integration

## Project Structure

- `/src/components`: React components
- `/src/store`: State management using Zustand
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Google Maps API
- Socket.io
- Zustand for state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request