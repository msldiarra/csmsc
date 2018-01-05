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

export function getViewer(viewerId) {
    return users['me'];
}