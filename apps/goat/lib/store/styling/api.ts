import axios from "axios";

export const stylingApi = {
    getCollections:()=>axios.get("https://geoapi.goat.dev.plan4better.de/collections"),
    getLayersByCollection:(id:string)=>axios.get(`https://geoapi.goat.dev.plan4better.de/collections/${id}/CDB1GlobalGrid/style.json`)
};
