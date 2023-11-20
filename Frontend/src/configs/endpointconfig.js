
// config.js
const apiconfig = {

    // NoofPods.jsx --> example http://192.168.0.66:4000/api/namespaces/namespace-pod-count
    apiUrl1: process.env.API_URL1,

    //pendingpods.jsx --> http://192.168.0.68:4000/api/services/ppods
    apiUrl2: process.env.API_URL2,

    //pendingpods.jsx --> http://192.168.0.68:4000/api/services/running-pods-not-ready
    apiUrl3: process.env.API_URL3,

    //service.jsx --> http://192.168.0.66:4000/api/services
    apiUrl4: process.env.API_URL4,

    //servicechart.jsx --> http://192.168.0.66:4000/api/namespaces/service
    apiUrl5: process.env.API_URL5,

    //Home.jsx --> http://192.168.0.66:4000/api/namespaces/
    apiUrl6: process.env.API_URL6,

    //Dashboard.jsx --> http://192.168.0.66:4000/api/namespaces/totalpods
    apiUrl7: process.env.API_URL7,

    //Dashbaord.jsx --> http://192.168.0.66:4000/api/namespaces/pendingpods
    apiUrl8: process.env.API_URL8,

    //Dashboard.jsx --> http://192.168.0.66:4000/api/namespaces/totalnamespaces
    apiUrl9: process.env.API_URL9,

}

export default apiconfig;
