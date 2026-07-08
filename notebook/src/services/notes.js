import axios from "axios"

const baseUrl = "/api/notes"

const getAll =async ()=>{
    const request = axios.get(baseUrl)
    const res = await request
    const nonExistingObj ={
        id:1000,
        content: "this does not exist in server",
        important: "false"
    }
    return res.data.concat(nonExistingObj)
}

const create =(newObject)=>{
    const request = axios.post(baseUrl, newObject)
    return request.then(res => res.data)
}
    
const update =async (id, newObject)=>{
    const res = await axios.put(`${baseUrl}/${id}`, newObject)
    return res.data
}

export default {getAll, create, update}