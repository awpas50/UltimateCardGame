export default class ApiDomain {
    static name =
        window.location.hostname === "ultimatecardgame.onrender.com"
            ? "https://ultimatecardgame.onrender.com"
            : `http://${window.location.hostname}:3000`
}
