## CLAUDE Instructions for this project

- You should always run the frontend server using `cd frontend; npm run preview;`. Any build issues should be fixed first until the server is running without errors.
- The acceptance tests are located in the `acceptance-tests` directory and should always pass. You should always ask for approval when changing anything in this folder. 
- Follow single responsability principle in everything - every module file folder or function should do just one thing.
- Be good and kind

### Architecture Requirements

- All mocks must be well-separated from business logic for easy replacement
- Mock implementations should be isolated in dedicated modules/files so when transitioning to real APIs, only mock modules should need replacement
- We follow a type of "clean architechture" where most of the application logic should be in modules which are agnostic to how their are implemented

#### Shared Types Library
- Create a dedicated npm package for shared types in a new folder under the root directory
- This package should contain all TypeScript interfaces/types shared between frontend and backend
- Package should be properly structured with package.json, tsconfig, and appropriate exports
- Frontend and backend should import types from this shared library
- This library should remain agnostic to implementation so can be imported from frontend and backend services in the future.

#### Core Logic Library
- Create a dedicated npm package for core logic in a new folder under the root directory
- This package should contain all business logic definitions and functions, to be shared between frontend and backend
- Package should be properly structured with package.json, tsconfig, and appropriate exports
- This library should remain agnostic to implementation so can be imported from frontend and backend services in the future.

#### Code Organization Principles
- Maintain clear separation of concerns, be extremly strict about this.
- All logic should be modular and testable
- Form validation should be handled separately from API calls
- Error handling should be centralized and consistent
