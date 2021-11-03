### How to test the application

- Open two terminal tabs and cd into the `backend` and `frontend` folders
- In the backend folder run `bundle` to install ruby gems
- In the frontend folder run `yarn install` to install packages
- Seed backend application using the cmmand `bin/rails db:seed`
- To start the backend application run  `bin/rails s`, make sure the port `4000` is free
- To start the backend application run  `yarn start`
- Check `frontend/src/utils.js` to make sure the url port corresponds with your backend port
- Open the url specified in the react terminal logs to test the application

NB: Due to time constraints I didn't add any request validation or input validation on the frontend.