import {  GraphQLObjectType } from 'graphql';


import AddBureauMutation from '../mutation/AddBureauMutation'
import EditBureauMutation from '../mutation/EditBureauMutation'
import AddMemberMutation from '../mutation/AddMemberMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import DeleteMediaMutation from '../mutation/DeleteMediaMutation'



export default new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addBureauMutation : AddBureauMutation,
        editBureauMutation : EditBureauMutation,
        addMemberMutation : AddMemberMutation,
        attachMediaMutation : AttachMediaMutation,
        deleteMediaMutation : DeleteMediaMutation
    })
});