# Course Horse

A platform designed to connect Learners and Educators, giving access to knowledge worldwide. From Elementary-level Biology to Collegiate-level Chemistry, Course Horse promotes varying levels of courses in all topics.

Course Horse is a Next.js Typescript based webapp, deployed using Vercel and MongoDB Atlas.

## Presentation/Demo

You can find our presentation/demo for Course Horse [here](https://youtu.be/aCPm-U6kKcU).

## Getting Started

There are 3 ways you can start using Course Horse.

### Official Vercel Deployment

To access Course Horse immediately, you can simply got to [course-horse.vercel.app](https://course-horse.vercel.app/) for our official deployment.

### Docker

You can also easily use Docker to quickly spin up an instance of Course Horse. Simply install [Docker](https://www.docker.com/) for your respective system, and insure that you also have [Docker Compose](https://docs.docker.com/compose/) (it should be bundled when downloading from their website).

From here, simply clone the Course Horse repository, navigate to the directory in a terminal, and run
`docker-compose up`. A Docker image of both Course Horse and MongoDB will be built and start running. After, simply access [localhost:3000](http://localhost:3000).

### Running Locally (Developer)

Being a Next.js project, Course Horse is very easy to get running on a system.

#### Node and NPM

To run Course Horse, you will need to have an installation of [Node](https://nodejs.org/) and [npm](https://www.npmjs.com/).

#### MongoDB

You will need access to a [MongoDB](https://www.mongodb.com/) database. This can be done by either having an instance locally installed on your machine to connect to, or having one available via the web (such as by using [MongoDB Atlas](https://www.mongodb.com/atlas/database)).

Once done, you will need to configure the .env (or .env.local) file and ensure that the correct connection info and credentials are entered.

#### Running Course Horse

After all system dependencies are installed, you will need to install the project dependencies using npm.

```
npm i
```

After, you should be able to run the Course Horse webserver. <br>
Run the developer build by using...

```
npm run dev
```

Run the production build by using...

```
npm run build
npm run start
```

## Seeding

By default, an enviornment variable called `ALLOW_SEED` is set to `true`. This allows you to access the `/api/seed` route to populate the database for testing. See `./seed.ts` for more info.
When not set to `true`, this feature is disabled (hence not available on the Vercel deployment).

## Features

Course Horse is a feature rich webapp designed to allow Educators to create courses for Learners all over the world to take.

### Creating/Taking Courses

Users with an accepted application, therefore becoming an educator, can create courses. From here, they can create lessons that have content rendered from Markdown, embedded YouTube videos, and a quizes.

Other users can then enroll in these courses to take them independently. When all lessons are marked as viewed and quizes completed, the course will be marked as completed.

Each lesson also has its own discussion for the enrolled users and creator to chat in.

### Applications and Application Portal

To become an educator on Course Horse, the user must send an application which can be written in Markdown and have links attached. After, an admin user must go to the Application Portal where they can search through applications and accept them. Once a user is accepted, they can create courses on the platform.

## The Develeopers

- David Cruz
  - da.cruz@aol.com
  - [David's Website](https://xxmistacruzxx.github.io/)
  - [David's Github](https://github.com/xxmistacruzxx)
  - [David's LinkedIn](https://www.linkedin.com/in/davidalexandercruz/)
- Tristan Kensinger
  - tkensing@stevens.edu
- Tyler Lane
  - tlane@stevens.edu

## APIs, Tools, & Libraries Used

Course Horse is developed using an assortment of modern Javascript oriented web development tools and frameworks.

### Development Tools

Course Horse is developed using...

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Iron-Session](https://www.npmjs.com/package/iron-session)
- [Sass](https://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)
- [React-Bootstrap](https://react-bootstrap.netlify.app/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [jQuery](https://www.npmjs.com/package/jquery)
- [Axios](https://www.npmjs.com/package/axios)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Marked](https://www.npmjs.com/package/marked)
- [DOMPurify](https://www.npmjs.com/package/dompurify)

### Deployment Tools

Course Horse is deployed using...

- [Vercel](https://vercel.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Docker](https://www.docker.com/)
- [Docker-Compose](https://docs.docker.com/compose/)
