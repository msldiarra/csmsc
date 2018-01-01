import {GraphQLInt,  GraphQLNonNull, GraphQLString} from 'graphql';
import {mutationWithClientMutationId, fromGlobalId} from 'graphql-relay';
import {DB} from '../database';
import {viewerType} from '../type/Types'
import {getViewer} from '../store/UserStore';

export default mutationWithClientMutationId({
    name: 'DeleteMember',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        memberId: { type: new GraphQLNonNull(GraphQLString) },
    },
    outputFields: {
        deletedMemberId : {
            type: GraphQLString,
            resolve: ({memberId}) => memberId
        },
        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        }
    },
    mutateAndGetPayload: ({viewerId, memberId}) => {

        return DB.models.member.destroy({where: {id: fromGlobalId(memberId).id }})
            .then(() => {
                return {
                    viewerId: viewerId,
                    memberId: memberId
                };
            })
    }
});
