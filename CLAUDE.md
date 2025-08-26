## CLAUDE Instructions for this project

- You should always run the frontend server using `cd frontend; npm run preview;`. Any build issues should be fixed first until the server is running without errors.
- The acceptance tests are located in the `acceptance-tests` directory and should always pass. You should always ask for approval when changing anything in this folder. 
- Follow single responsability principle in everything - every module file folder or function should do just one thing.
- Be good and kind

### Architecture Requirements for Login System

#### Authentication Flow
- Login screen must accept user's email and password
- Credentials should be validated against a backend system
- Upon successful authentication, redirect user to a welcome page that displays "welcome"
- Handle various error states (invalid email format, incorrect credentials, empty fields)

#### Backend Integration
- Backend authentication should initially be mocked in frontend code
- All backend mocks must be well-separated from business logic for easy replacement
- Mock implementations should be isolated in dedicated modules/files
- When transitioning to real APIs, only mock modules should need replacement

#### Shared Types Library
- Create a dedicated npm package for shared types in a new folder under the root directory
- This package should contain all TypeScript interfaces/types shared between frontend and backend
- Package should be properly structured with package.json, tsconfig, and appropriate exports
- Frontend should import types from this shared library

#### Code Organization Principles
- Maintain clear separation of concerns
- Authentication logic should be modular and testable
- Form validation should be handled separately from API calls
- Error handling should be centralized and consistent
