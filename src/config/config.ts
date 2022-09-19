
/*
* @author Prafful Bansal
* @description config file for the application
*/
class Locals {
    public static config(): any {
       const port : number = parseInt(process.env.PORT as string) || 8080;
       const secret : string = process.env.SECRET as string || "qwerty";
       const mongooseUrl : string = process.env.MONGOOSE_URL as string || "mongodb+srv://praffulbansal123:Bansal%400966@cluster0.d27ax.mongodb.net/PB-ECommerce-DB?retryWrites=true&w=majority";
       const ttl : number = parseInt(process.env.TTL as string) || 172800;
       const jwtExpiration : string = process.env.JWT_EXPIRATION as string || "3600s";
       const jwtSecret : string = process.env.JWT_SECRET as string || "qwerty123";
       const saltRound : number = parseInt(process.env.SALT_ROUND as string) || 12;
       const bucketName : string = process.env.AWS_BUCKET_NAME as string || "ecommerce--bucket";
       const region : string = process.env.AWS_BUCKET_REGION as string || "ap-south-1";
       const accessKeyId : string = process.env.AWS_ACCESS_KEY as string || "AKIA5MMLIOTKXJUOIBKO";
       const secretAccessKey : string = process.env.AWS_SECRET_KEY as string || "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";

       return {
            port,
            secret,
            mongooseUrl,
            ttl,
            jwtExpiration,
            jwtSecret,
            saltRound,
            bucketName,
            region,
            accessKeyId,
            secretAccessKey
        };
    };
}

export default Locals;
