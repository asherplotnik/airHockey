// Global settings which are the same for development and production: 
class Globals {
}

// Global settings which are suitable only for development:
class DevelopmentGlobals extends Globals {
    public urls = {
        apiWs : "http://localhost:8080/ws",
        apiRest: "http://localhost:8080/api"
    };
}

// Global settings which are suitable only for production:
class ProductionGlobals extends Globals {
    public urls = {
        apiWs : "http://localhost:8080/ws",
        apiRest: "http://localhost:8080/api"
    };
}

// Creating the correct object
const globals = process.env.NODE_ENV === "development" ? new DevelopmentGlobals() : new ProductionGlobals();

export default globals;
