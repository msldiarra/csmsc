import {  GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import {  mutationWithClientMutationId } from 'graphql-relay';
import { DB } from '../database';
import {viewerType} from '../type/Types'
import sanitize from 'sanitize-filename';
import {getViewer} from '../store/UserStore';

export default mutationWithClientMutationId({
    name: 'AttachMedia',
    inputFields: {
        viewerId: { type: new GraphQLNonNull(GraphQLString) },
        uri: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
    },
    outputFields: {

        viewer: {
            type: viewerType,
            resolve: ({viewerId}) => getViewer(viewerId),
        }
    },
    mutateAndGetPayload: (input, options) => {

        const filename = sanitize(input.name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));
        const mimeType = input.name.substring(input.name.lastIndexOf('.')+1);


        return DB.models.media.create({
                name: filename,
                uri: '/docs/' + filename,
                mime_type: mimeType
            })
            .then((media) => {
                return  {
                    viewerId: input.viewerId,
                    media: media
                }
            })

    },
});
