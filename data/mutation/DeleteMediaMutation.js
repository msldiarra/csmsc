import {GraphQLInt,  GraphQLNonNull, GraphQLString} from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';
import {DB} from '../database';
import {viewerType} from '../type/Types'
import {getViewer} from '../store/UserStore';

export default mutationWithClientMutationId({
    name: 'DeleteMedia',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        mediaId: { type: new GraphQLNonNull(GraphQLString) },
        mediaName: { type: new GraphQLNonNull(GraphQLString) }
    },
    outputFields: {
        deletedMediaId : {
            type: GraphQLString,
            resolve: ({mediaId}) => mediaId
        },
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        }
    },
    mutateAndGetPayload: ({viewerId, mediaId, mediaName}) => {

        return DB.models.media.destroy({where: {name: mediaName }})
            .then(() => {
                return {
                    viewerId: viewerId,
                    mediaId: mediaId
                };
            })
    }
});
