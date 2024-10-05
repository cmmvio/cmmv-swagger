module.exports = {
    env: process.env.NODE_ENV,
    
    server: {
        host: process.env.HOST || "0.0.0.0",
        port: process.env.PORT || 3000,        
    },

    rpc: {
        enabled: false
    },

    swagger: {
        path: "/docs",
        docs: {
            info: {
                version: "0.0.1",
                title: "Contract-Model-Model-View (CMMV)",
                description: "CMMV is a minimalist Node.js framework focused on contract-driven development, combining automatic code generation, RPC communication, and declarative programming to build efficient, scalable applications with simplified backend and frontend integration."
            },
            host: "http://localhost:3000",
            basePath: "/",
        }
    }
};