
class Router {

    constructor(routes = []) {
        this.routes = routes;
    }

    getRoutes() {
        return this.routes;
    }

    addRoute(route) {
        this.routes.push(route);
    }

    route(endpoint, method, request) {
        return new Promise((resolve, reject) => {
            const route = this.routes.find(route => route.route === endpoint && route.method === method);
            if (!route) {
                reject({
                    code: 404,
                    response: { error: 'Route not found' }
                });
            }
            const { code = 200, response = { error: 'Response not found' }  } = route.handler.execute(request);
            resolve({
                code,
                response
            });
        });
    }

}

module.exports = Router;
