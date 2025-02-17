
# Video List App

A React-based application that allows users to filter and view a list of videos, complete with search and pagination features. The app fetches video data from an API and provides an intuitive user interface with various filter options, including keyword search, likes range, and date range filtering.

## Features

- **Search by Title**: Allows users to search for videos based on their title.
- **Likes Range Filter**: Set a minimum like threshold for the displayed videos.
- **Date Range Filter**: Filter videos based on a specified start and end date.
- **Pagination**: Navigate through video pages with previous and next buttons.
- **Video Details**: View additional video information such as description and thumbnail.
- **Dark/Light Mode Support**: Toggle between dark and light themes.

## Technologies Used

- **React**: For building the user interface and managing state.
- **axios**: For making API requests.
- **react-table**: For rendering and managing the table of videos.
- **date-fns**: For date formatting.
- **TailwindCSS**: For styling the components.
- **Next Themes**: For handling theme switching (light/dark mode).
- **Lodash**: For debouncing input changes.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/video-list-app.git
   cd video-list-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser.

## Usage

1. **Search for Videos**: Use the search input to search for videos by title. The list will update automatically as you type.
2. **Filter by Likes**: Use the slider to set a minimum likes threshold. The table will only show videos with at least that many likes.
3. **Filter by Date**: Use the calendar popovers to select a start and/or end date. The videos will be filtered to show only those published within the selected range.
4. **Pagination**: Navigate through pages using the "Previous" and "Next" buttons. The current page and total pages are displayed at the bottom.

## Components

### `VideoList`

The main component that renders the list of videos with all the filters and pagination.

- **Filters**: Search, likes range, start date, and end date.
- **Video Table**: Displays video information in a paginated table with columns for title, likes, published date, description, and thumbnail.
- **Loading State**: A loading spinner is shown while data is being fetched.

### `ThemeProvider`

Wraps the application in a theme provider to enable dark and light mode functionality.

## API

This app fetches video data from the following API endpoint:
```
GET http://127.0.0.1:8000/api/filtered-videos/
```

### Query Parameters

- `page`: Page number (defaults to 1).
- `keyword`: Keyword to search for in video titles.
- `min_likes`: Minimum number of likes.
- `start_date`: Start date for filtering videos by publication date.
- `end_date`: End date for filtering videos by publication date.

Example request:
```
GET http://127.0.0.1:8000/api/filtered-videos/?page=1&keyword=react&min_likes=1000&start_date=2023-01-01&end_date=2023-12-31
```

