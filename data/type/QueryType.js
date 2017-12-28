import { GraphQLObjectType, GraphQLInt} from 'graphql'
import {viewerType, nodeField} from './Types'
import { VIEWER_ID, registerViewerId } from '../store/UserStore';

export default new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField,
        // Add your own root fields here
        viewer: {
            type: viewerType,
            args: { viewerId: { name: 'viewerId', type: GraphQLInt} },
            resolve: (root, {viewerId}) => {

                var viewer = {id: VIEWER_ID, userId: viewerId};
                registerViewerId(viewer);
                return viewer
            }
        }
    })
});