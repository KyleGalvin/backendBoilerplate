import defaultConfig from "./local";

if(process.env.NODE_ENV === "HEROKU_DEV") {
	defaultConfig.connectionString =  process.env.DATABASE_URL as string;
}


export default defaultConfig;