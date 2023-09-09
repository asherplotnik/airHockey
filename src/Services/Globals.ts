// Global settings which are the same for development and production: 
class Globals {
}

// Global settings which are suitable only for development:
class DevelopmentGlobals extends Globals {
    public urls = {
        localUrl : "http://localhost:3000/api/v1/",
        apiWs : "http://192.168.1.244:3000/ws"
    };
}

// Global settings which are suitable only for production:
class ProductionGlobals extends Globals {
    public urls = {
        localUrl : "https://goldfish-app-m83gp.ondigitalocean.app/api/v1/",
        apiWs : "http://192.168.1.244:3000/ws"
    };
}

// Creating the correct object
const globals = process.env.NODE_ENV === "development" ? new DevelopmentGlobals() : new ProductionGlobals();

export default globals;
