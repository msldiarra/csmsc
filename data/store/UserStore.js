import {DB} from '../database'

export class Viewer extends Object {}

export const VIEWER_ID = 'me';

var viewer = new Viewer();
viewer.id = VIEWER_ID;

var users = {}

export function registerViewerId(viewer) {

    if(users[viewer.id] == undefined) {
        users[viewer.id] = viewer
    }
}

/*
export function registerViewerId(viewer) {

    console.log('------------------- users before --------------------------')
    console.log(users)
    users[viewer.id] = viewer

    console.log('------------------- users after --------------------------')
    console.log(users)

}
*/

export function getViewer(viewerId) {

    console.log("getViewer with Id : " + viewerId)
    console.log("registered users: ")
    console.log(users)
    console.log("getViewer : " + JSON.stringify(users[viewerId]))

    //return users[viewerId] == undefined ? DB.models.user.findOne({where: {id: viewerId}}) : users[viewerId]
    return users['me'];
}