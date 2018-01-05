import {  GraphQLObjectType } from 'graphql';


import AddBureauMutation from '../mutation/AddBureauMutation'
import NewBureauMutation from '../mutation/NewBureauMutation'
import EditBureauMutation from '../mutation/EditBureauMutation'
import ModifyBureauMutation from '../mutation/ModifyBureauMutation'
import AddMemberMutation from '../mutation/AddMemberMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import DeleteMediaMutation from '../mutation/DeleteMediaMutation'
import DeleteMemberMutation from '../mutation/DeleteMemberMutation'
import EditMemberMutation from '../mutation/EditMemberMutation'



export default new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addBureauMutation : AddBureauMutation,
        newBureauMutation : NewBureauMutation,
        editBureauMutation : EditBureauMutation,
        modifyBureauMutation : ModifyBureauMutation,
        addMemberMutation : AddMemberMutation,
        attachMediaMutation : AttachMediaMutation,
        deleteMediaMutation : DeleteMediaMutation,
        deleteMemberMutation : DeleteMemberMutation,
        editMemberMutation : EditMemberMutation,
    })
});