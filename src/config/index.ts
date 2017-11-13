import defaultConfig from "./local";

if(process.env.NODE_ENV === "DEV") {
	defaultConfig.connectionString =  process.env.DATABASE_URL as string;
	defaultConfig.httpsPort = Number(process.env.PORT as string);
}


export default defaultConfig;